package com.welcome.tteoksang.game.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.game.dto.*;
import com.welcome.tteoksang.game.dto.log.*;
import com.welcome.tteoksang.game.dto.server.ServerProductInfo;
import com.welcome.tteoksang.game.dto.trade.BuyProductInfo;
import com.welcome.tteoksang.game.dto.trade.ProductTradeInfo;
import com.welcome.tteoksang.game.dto.upgrade.UpgradeBrokerInfo;
import com.welcome.tteoksang.game.dto.upgrade.UpgradeVehicleInfo;
import com.welcome.tteoksang.game.dto.upgrade.UpgradeWarehouseInfo;
import com.welcome.tteoksang.game.dto.trade.SellProductInfo;
import com.welcome.tteoksang.game.dto.user.RedisGameInfo;
import com.welcome.tteoksang.game.dto.user.UserProductInfo;
import com.welcome.tteoksang.game.exception.*;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.dto.Broker;
import com.welcome.tteoksang.resource.dto.Vehicle;
import com.welcome.tteoksang.resource.dto.Warehouse;
import com.welcome.tteoksang.resource.repository.BrokerRepository;
import com.welcome.tteoksang.resource.repository.VehicleRepository;
import com.welcome.tteoksang.resource.repository.WarehouseRepository;
import com.welcome.tteoksang.resource.type.MessageType;
import com.welcome.tteoksang.user.exception.TitleNotExistException;
import com.welcome.tteoksang.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class PrivateInteractionServiceImpl implements PrivateInteractionService {

    private final UserService userService;
    private final RedisService redisService;

    private final WarehouseRepository warehouseRepository;
    private final BrokerRepository brokerRepository;
    private final VehicleRepository vehicleRepository;
    private final ServerInfo serverInfo;

    final double DISCOUNT_RATE = 100.0; // 할인율을 %로 표현

    @Override
    public GameMessageInfo changeTitle(LinkedHashMap<String, Object> body, int titleId, String userId) {
        boolean isSuccess = false;
        try {
            userService.updateUserTitle(titleId, userId);
            isSuccess = true;
        } catch (TitleNotExistException e) {
            log.error(e.getMessage());
        }
        return GameMessageInfo.builder()
                .body(body)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo buyProduct(LinkedHashMap<String, Object> body, String userId) {
        // 유저의 게임 정보 가져오기
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        Object responseBody = body;
        boolean isSuccess = true;
        // 로그 저장
        List<String> logList = new ArrayList<>();
        if (redisGameInfo != null) {
            // 유저가 가진 농산물 정보 불러오기
            // FIXME: 서버에서 수량 제한을 여기서 설정
            // 초기 설정
            Map<Integer, UserProductInfo> products = redisGameInfo.getProducts();
            // 현재 소지 금액
            long remainGold = redisGameInfo.getGold();

            // 한 턴의 이동 가능 수단
            Vehicle vehicle = vehicleRepository.findById(redisGameInfo.getVehicleLevel())
                    .orElseThrow(VehicleNotExistException::new);
            // 한턴에 살 수 있는 양
            int serverQuantity = vehicle.getVehicleCapacity();
            // 이번 턴에 산 농산물 개수
            int turnPurchaseQuantity = redisGameInfo.getPurchaseQuantity();
            // 살 수 있는 수량
            int remainPurchaseQuantity = serverQuantity - turnPurchaseQuantity;

            // 남은 창고 공간
            Warehouse currentWarehouse = warehouseRepository.findById(redisGameInfo.getWarehouseLevel())
                    .orElseThrow(WarehouseNotExistException::new);
            int remainWarehouseQuantity = currentWarehouse.getWarehouseCapacity() - redisGameInfo.getTotalProductQuantity();
            // 창고에 있는 전체 수량
            int totalProductQuantity = redisGameInfo.getTotalProductQuantity();

            /* 소지 금액, 소지한 농산물량, 한 시즌 농산물 구매량, 한 턴 구매 최대 수량, 한 턴 작물 구매 최대 수량,
               창고 남은 수량, 을 넘어가면 롤백하기 위해 깊은 복사
            */
            Map<Integer, UserProductInfo> pastProducts = new HashMap<>(products);
            long pastGold = redisGameInfo.getGold();    // 과거 소지 금액
            int pastPurchaseQuantity = redisGameInfo.getPurchaseQuantity(); // 과거 구매 가능 수량
            int pastTotalProductQuantity = redisGameInfo.getTotalProductQuantity(); // 창고의 농산물양

            try {
                // FIXME: 클라이언트에서 구매한 농산물의 수량, 각 농산물의 총 가격 합을 보내줌 이걸 서버 가격으로 바꿔야 됨
                // body에 있는 구매 정보 파싱
                Map<Integer, UserProductInfo> messageProductsMap = getProductBody(body);

                Map<Integer, ServerProductInfo> serverProductInfoMap = serverInfo.getProductInfoMap();
                // messageProductsMap를 순회
                for (Map.Entry<Integer, UserProductInfo> messageProduct : messageProductsMap.entrySet()) {
                    Integer messageProductId = messageProduct.getKey();
                    UserProductInfo messageProductInfo = messageProduct.getValue();

                    int messagePurchaseQuantity = messageProductInfo.getProductQuantity();  // 메세지 구매량
//                    long messageProductTotalCost = messageProductInfo.getProductTotalCost(); // 메세지 총 금액
                    long serverProductTotalCost = (long) serverProductInfoMap.get(messageProductId)
                            .getProductCost() * messagePurchaseQuantity; // 서버의 농산물 총 금액
                    // 한 턴에 살 수 있는 현재 농산물 개수
                    int serverProductMaxQuantity = serverProductInfoMap.get(messageProductId).getProductMaxQuantity();
                    int remainProductMaxQuantity = serverProductMaxQuantity;
                    if (products.get(messageProductId) != null)
                        remainProductMaxQuantity = serverProductMaxQuantity - products.get(messageProductId).getProductPurchaseQuantity();
                    // 소지금보다 금액이 높으면, 한 턴에 구매할 수 있는 농산물 수량보다 높으면, 창고의 남은 자리가 없으면 구매불가, 롤백
                    if (remainGold < serverProductTotalCost
                            || remainPurchaseQuantity < messagePurchaseQuantity
                            || remainWarehouseQuantity < messagePurchaseQuantity
                            || remainProductMaxQuantity < messagePurchaseQuantity
                    ) {
                        products = pastProducts;    // 과거 작물 정보
                        remainGold = pastGold;      // 과거 골드 정보
                        turnPurchaseQuantity = pastPurchaseQuantity;    // 과거 한턴에 구매 가능량
                        totalProductQuantity = pastTotalProductQuantity;    // 과거 가지고 있는 전체 물량
                        isSuccess = false;
                        if (remainGold < serverProductTotalCost)
                            log.error("[PrivateInteractionServiceImpl] - buyProduct: 구매 실패입니다.");
                        else if (remainPurchaseQuantity < messagePurchaseQuantity)
                            log.error("[PrivateInteractionServiceImpl] - buyProduct: 한 턴에 구매할 수 있는 제한을 넘었습니다.");
                        else if (remainWarehouseQuantity < messagePurchaseQuantity)
                            log.error("[PrivateInteractionServiceImpl] - buyProduct: 창고에 남은 자리가 없습니다.");
                        else
                            log.error("[PrivateInteractionServiceImpl] - buyProduct: 구매할 수 있는 농산물 제한을 넘었습니다.");
                        break;
                    }

                    // 이미 가지고 있는 작물
                    if (products.containsKey(messageProductId)) {
                        UserProductInfo redisProductInfo = products.get(messageProductId);

                        // 나의 농산물 정보 갱신
                        products.put(messageProductId, UserProductInfo.builder()
                                .productQuantity(redisProductInfo.getProductQuantity() + messagePurchaseQuantity)
                                .productPurchaseQuantity(redisProductInfo.getProductPurchaseQuantity() + messagePurchaseQuantity)
                                .productTotalCost(redisProductInfo.getProductTotalCost() + messageProductInfo.getProductTotalCost())
                                .build());
                    }
                    // 새로운 작물 추가
                    else {
                        products.put(messageProductId, UserProductInfo.builder()
                                .productQuantity(messagePurchaseQuantity)
                                .productPurchaseQuantity(messagePurchaseQuantity)
                                .productTotalCost(serverProductTotalCost)
                                .build()
                        );
                    }

                    // 로그 저장
                    BuyLogInfo logInfo = BuyLogInfo.builder()
                            .seasonId(serverInfo.getSeasonId())
                            .userId(userId)
                            .gameId(redisGameInfo.getGameId())
                            .turn(serverInfo.getCurrentTurn())
                            .productId(messageProductId)
                            .purchasedQuantity(messagePurchaseQuantity)
                            .productOutcome(serverProductTotalCost)
                            .productQuantity(products.get(messageProductId).getProductQuantity())
                            .productCost(serverProductInfoMap.get(messageProductId).getProductCost())
                            .build();
                    LogMessage logMessage = LogMessage.builder()
                            .type("BUY")
                            .body(logInfo)
                            .build();
                    ObjectMapper objectMapper = new ObjectMapper();
                    try {
                        String logData = objectMapper.writeValueAsString(logMessage);
                        logList.add(logData);
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException(e);
                    }

                    // 갱신
                    remainGold -= serverProductTotalCost;      // 구매 후 남은 금액
                    turnPurchaseQuantity += messagePurchaseQuantity;    // 이번 턴 구매량
                    remainPurchaseQuantity -= messagePurchaseQuantity;  // 남은 구매 가능량
                    remainWarehouseQuantity -= messagePurchaseQuantity; // 남은 창고 공간
                    totalProductQuantity += messagePurchaseQuantity;    // 전체 농산물 양
                }

                // 레디스 갱신
                redisGameInfo.setGold(remainGold);
                redisGameInfo.setProducts(products);
                redisGameInfo.setPurchaseQuantity(turnPurchaseQuantity);
                redisGameInfo.setTotalProductQuantity(totalProductQuantity);

                redisService.setValues(redisGameInfoKey, redisGameInfo);

                // 메세지 바디
                List<ProductTradeInfo> newProductList = getProductList(products);

                // 메세지 바디에 모든 농산물 정보를 저장
                responseBody = BuyProductInfo.builder()
                        .gold(redisGameInfo.getGold())
                        .productList(newProductList)
                        .purchasedQuantity(redisGameInfo.getPurchaseQuantity())
                        .build();
            } catch (Exception e) {
                isSuccess = false;
                log.error(e.getMessage());
            }
        } else {
            isSuccess = false;
            log.error("[PrivateInteractionServiceImpl] - buyProduct: 없는 게임 정보입니다.");
        }

        if (isSuccess) {
            // 로그 찍기
            for (String logData : logList) {
                log.debug(logData);
            }
        }
        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo sellProduct(LinkedHashMap<String, Object> body, String userId) {
        // 유저의 게임 정보 가져오기
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        Object responseBody = body;
        boolean isSuccess = true;
        // 로그 저장
        List<String> logList = new ArrayList<>();
        // 게임 정보가 있는 경우 판매
        if (redisGameInfo != null) {
            // 유저가 가진 농산물 정보 불러오기
            // FIXME: 서버에서 수량 제한을 여기서 설정

            // 초기 설정
            Map<Integer, UserProductInfo> products = redisGameInfo.getProducts();
            // 현재 소지 금액
            long remainGold = redisGameInfo.getGold();
            // 창고에 있는 전체 수량
            int totalProductQuantity = redisGameInfo.getTotalProductQuantity();

            // 수수료 계산을 위해 불러오기
            Broker currentBroker = brokerRepository.findById(redisGameInfo.getBrokerLevel())
                    .orElseThrow(BrokerNotExistException::new);
            int productCharge = currentBroker.getBrokerFeeRate();

            // 소지 금액, 구매 최대 수량, 창고 남은 수량, 을 넘어가면 롤백하기 위해 깊은 복사
            Map<Integer, UserProductInfo> pastProducts = new HashMap<>(products);
            long pastGold = redisGameInfo.getGold();
            int pastTotalProductQuantity = redisGameInfo.getTotalProductQuantity();

            try {
                // FIXME: 클라이언트에서 구매한 농산물의 수량, 각 농산물의 총 가격 합을 보내줌 이걸 서버 가격으로 바꿔야 됨
                // body에 있는 구매 정보 파싱
                Map<Integer, UserProductInfo> messageProductsMap = getProductBody(body);

                Map<Integer, ServerProductInfo> serverProductInfoMap = serverInfo.getProductInfoMap();
                // messageProductsMap를 순회
                for (Map.Entry<Integer, UserProductInfo> messageProduct : messageProductsMap.entrySet()) {
                    // 메세지 내부 농산물 정보
                    Integer messageProductId = messageProduct.getKey();
                    UserProductInfo messageProductInfo = messageProduct.getValue();

                    int messageSellQuantity = messageProductInfo.getProductQuantity();  // 메세지 판매량
//                    long messageProductTotalCost = messageProductInfo.getProductTotalCost(); // 메세지 총 금액
                    long serverProductTotalCost = (long) serverProductInfoMap.get(messageProductId)
                            .getProductCost() * messageSellQuantity; // 서버의 농산물 판매 총 금액

                    UserProductInfo redisProductInfo = products.get(messageProductId);
                    // 메세지에 해당하는 작물이 있을때, 현재 가지고 있는 수량 안의 판매 요청 처리
                    if (!products.containsKey(messageProductId) ||
                            redisProductInfo.getProductQuantity() < messageSellQuantity) {

                        products = pastProducts;    // 과거 작물 정보
                        remainGold = pastGold;      // 과거 골드 정보
                        totalProductQuantity = pastTotalProductQuantity;    // 과거 가지고 있는 전체 물량
                        isSuccess = false;

                        if (!products.containsKey(messageProductId))
                            log.error("[PrivateInteractionServiceImpl] - sellProduct: 해당 작물 없음");
                        else if (redisProductInfo.getProductQuantity() < messageSellQuantity)
                            log.error("[PrivateInteractionServiceImpl] - sellProduct: 작물이 부족합니다.");
                        break;
                    }
                    // 판매 처리
                    long redisProductTotalCost = redisProductInfo.getProductTotalCost();
                    long calculateProductTotalCost = (long) (redisProductTotalCost -
                            Math.floor((double) redisProductTotalCost / redisProductInfo.getProductQuantity())
                                    * messageSellQuantity);
                    // 해당 농산물의 남은 수량
                    int remainQuantity = redisProductInfo.getProductQuantity() - messageSellQuantity;
                    // 남은 전체 농산물 수량
                    totalProductQuantity -= messageSellQuantity;

                    // 판매 후 금액
                    double chargeRate = (DISCOUNT_RATE - productCharge) / DISCOUNT_RATE;
                    long adjustedCost = (long) Math.floor(serverProductTotalCost * chargeRate);
                    remainGold += adjustedCost;
//                    remainGold += (long) (messageProductTotalCost * Math.ceil((double) (100 - productCharge) /100)); //FIXME: 서버 가격으러 변경해야 됨

                    // 로그 저장
                    SellLogInfo logInfo = SellLogInfo.builder()
                            .seasonId(serverInfo.getSeasonId())
                            .userId(userId)
                            .gameId(redisGameInfo.getGameId())
                            .turn(serverInfo.getCurrentTurn())
                            .productId(messageProductId)
                            .productIncome(serverProductTotalCost)
                            .soldQuantity(products.get(messageProductId).getProductQuantity())
                            .brokerFee((int) (serverProductTotalCost - adjustedCost))
                            .productProfit(adjustedCost)
                            .productCost(serverProductInfoMap.get(messageProductId).getProductCost())
                            .build();

                    LogMessage logMessage = LogMessage.builder()
                            .type("SELL")
                            .body(logInfo)
                            .build();
                    ObjectMapper objectMapper = new ObjectMapper();
                    try {
                        String logData = objectMapper.writeValueAsString(logMessage);
                        logList.add(logData);
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException(e);
                    }

                    // product 반영
                    products.replace(messageProductId, UserProductInfo.builder()
                            .productQuantity(remainQuantity)
                            .productPurchaseQuantity(redisProductInfo.getProductPurchaseQuantity())
                            .productTotalCost(calculateProductTotalCost)
                            .build()
                    );
                }

                // 레디스 갱신
                redisGameInfo.setGold(remainGold);
                redisGameInfo.setProducts(products);
                redisGameInfo.setTotalProductQuantity(totalProductQuantity);

                redisService.setValues(redisGameInfoKey, redisGameInfo);

                List<ProductTradeInfo> newProductList = getProductList(products);
                // 메세지 바디에 모든 농산물 정보를 저장
                responseBody = SellProductInfo.builder()
                        .gold(redisGameInfo.getGold())
                        .productList(newProductList)
                        .build();
            } catch (Exception e) {
                isSuccess = false;
                log.error(e.getMessage());
            }
        } else {
            isSuccess = false;
            log.error("[PrivateInteractionServiceImpl] - sellProduct: 없는 게임 정보입니다.");
        }

        if (isSuccess) {
            // 로그 찍기
            for (String logData : logList) {
                log.debug(logData);
            }
        }

        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo upgradeWarehouse(LinkedHashMap<String, Object> body, String userId) {
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        Object responseBody = body;
        boolean isSuccess = false;
        // 로그 저장
        List<String> logList = new ArrayList<>();
        if (redisGameInfo != null) {
            int nextWarehouseLevel = redisGameInfo.getWarehouseLevel() + 1;
            try {
                // 다음 레벨이 있는지 확인
                brokerRepository.findById(nextWarehouseLevel).orElseThrow(BrokerNotExistException::new);
                // 남은 금액 확인
                long remainGold = calculateUpgradeFee(redisGameInfo.getGold(), MessageType.UPGRADE_WAREHOUSE, nextWarehouseLevel);
                if (remainGold != -1) {
                    // 로그 저장
                    saveUpgradeLog(userId, redisGameInfo, remainGold, logList);

                    redisGameInfo.setGold(remainGold);
                    redisGameInfo.setWarehouseLevel(nextWarehouseLevel);

                    responseBody = UpgradeWarehouseInfo.builder()
                            .gold(redisGameInfo.getGold())
                            .warehouseLevel(redisGameInfo.getWarehouseLevel())
                            .build();

                    redisService.setValues(redisGameInfoKey, redisGameInfo);
                    isSuccess = true;
                } else {
                    log.debug("[PrivateInteractionServiceImpl] - upgradeWarehouse: 금액 부족");
                }
            } catch (WarehouseNotExistException e) {
                log.error("[PrivateInteractionServiceImpl] - upgradeWarehouse: 없는 창고 입니다.");
            }
        } else {
            log.error("[PrivateInteractionServiceImpl] - upgradeWarehouse: 없는 게임 정보입니다.");
        }

        if (isSuccess) {
            // 로그 찍기
            for (String logData : logList) {
                log.debug(logData);
            }
        }

        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo upgradeBroker(LinkedHashMap<String, Object> body, String userId) {
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        Object responseBody = body;
        boolean isSuccess = false;
        // 로그 저장
        List<String> logList = new ArrayList<>();
        if (redisGameInfo != null) {
            int nextBrokerLevel = redisGameInfo.getBrokerLevel() + 1;
            try {
                // 다음 레벨이 있는지 확인
                brokerRepository.findById(nextBrokerLevel).orElseThrow(BrokerNotExistException::new);
                // 남은 금액 확인
                long remainGold = calculateUpgradeFee(redisGameInfo.getGold(), MessageType.UPGRADE_BROKER, nextBrokerLevel);
                if (remainGold != -1) {
                    // 로그 저장
                    saveUpgradeLog(userId, redisGameInfo, remainGold, logList);

                    redisGameInfo.setGold(remainGold);
                    redisGameInfo.setBrokerLevel(nextBrokerLevel);

                    responseBody = UpgradeBrokerInfo.builder()
                            .gold(redisGameInfo.getGold())
                            .brokerLevel(redisGameInfo.getBrokerLevel())
                            .build();

                    redisService.setValues(redisGameInfoKey, redisGameInfo);
                    isSuccess = true;
                } else {
                    log.debug("[PrivateInteractionServiceImpl] - upgradeBroker: 금액 부족");
                }
            } catch (BrokerNotExistException e) {
                log.error("[PrivateInteractionServiceImpl] - upgradeBroker: 없는 환전소 입니다.");
            }
        } else {
            log.error("[PrivateInteractionServiceImpl] - upgraderBroker: 없는 게임 정보입니다.");
        }

        if (isSuccess) {
            // 로그 찍기
            for (String logData : logList) {
                log.debug(logData);
            }
        }

        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }


    @Override
    public GameMessageInfo upgradeVehicle(LinkedHashMap<String, Object> body, String userId) {
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        Object responseBody = body;
        boolean isSuccess = false;
        // 로그 저장
        List<String> logList = new ArrayList<>();
        if (redisGameInfo != null) {
            int nextVehicleLevel = redisGameInfo.getVehicleLevel() + 1;
            try {
                // 다음 레벨이 있는지 확인
                vehicleRepository.findById(nextVehicleLevel).orElseThrow(VehicleNotExistException::new);
                // 남은 금액 확인
                long remainGold = calculateUpgradeFee(redisGameInfo.getGold(), MessageType.UPGRADE_VEHICLE, nextVehicleLevel);
                if (remainGold != -1) {
                    redisGameInfo.setGold(remainGold);
                    redisGameInfo.setVehicleLevel(nextVehicleLevel);

                    // 로그 저장
                    saveUpgradeLog(userId, redisGameInfo, remainGold, logList);

                    redisGameInfo.setGold(remainGold);
                    redisGameInfo.setVehicleLevel(nextVehicleLevel);

                    responseBody = UpgradeVehicleInfo.builder()
                            .gold(redisGameInfo.getGold())
                            .vehicleLevel(redisGameInfo.getVehicleLevel())
                            .build();

                    redisService.setValues(redisGameInfoKey, redisGameInfo);
                    isSuccess = true;
                } else {
                    log.debug("[PrivateInteractionServiceImpl] - upgradeVehicle: 금액 부족");
                }
            } catch (VehicleNotExistException e) {
                log.error("[PrivateInteractionServiceImpl] - upgradeVehicle: 없는 운송수단 입니다.");
            }
        } else {
            log.error("[PrivateInteractionServiceImpl] - upgradeVehicle: 없는 게임 정보입니다.");
        }

        if (isSuccess) {
            // 로그 찍기
            for (String logData : logList) {
                log.debug(logData);
            }
        }

        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    private RedisGameInfo getRedisGameInfo(String userId) {
        // 레디스에 있는 게임 정보 불러오기
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        RedisGameInfo redisGameInfo = null;
        if (redisService.hasKey(redisGameInfoKey)) {
            redisGameInfo = (RedisGameInfo) redisService.getValues(redisGameInfoKey);
        }
        return redisGameInfo;
    }

    private Map<Integer, UserProductInfo> getProductBody(LinkedHashMap<String, Object> body) throws JsonProcessingException {
        Object productsObj = body.get("products");
        ObjectMapper mapper = new ObjectMapper();
        String productsJson = mapper.writeValueAsString(productsObj);
        TypeReference<Map<Integer, UserProductInfo>> typeRef = new TypeReference<>() {
        };
        return mapper.readValue(productsJson, typeRef);
    }

    private List<ProductTradeInfo> getProductList(Map<Integer, UserProductInfo> products) {
        // 메세지 바디
        List<ProductTradeInfo> newProductList = new ArrayList<>();
        for (Map.Entry<Integer, UserProductInfo> entry : products.entrySet()) {
            Integer productId = entry.getKey();
            UserProductInfo userProductInfo = entry.getValue();

            ProductTradeInfo productTradeInfo = new ProductTradeInfo();
            productTradeInfo.setProductId(productId);
            productTradeInfo.setProductQuantity(userProductInfo.getProductQuantity());
            productTradeInfo.setProductTotalCost(userProductInfo.getProductTotalCost());

            newProductList.add(productTradeInfo);
        }
        return newProductList;
    }

    private void saveUpgradeLog(String userId, RedisGameInfo redisGameInfo, long remainGold, List<String> logList) {
        UpgradeLogInfo logInfo = UpgradeLogInfo.builder()
                .seasonId(serverInfo.getSeasonId())
                .userId(userId)
                .gameId(redisGameInfo.getGameId())
                .turn(serverInfo.getCurrentTurn())
                .upgradeFee((int) (redisGameInfo.getGold() - remainGold))
                .build();

        LogMessage logMessage = LogMessage.builder()
                .type("UPGRADE")
                .body(logInfo)
                .build();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String logData = objectMapper.writeValueAsString(logMessage);
            logList.add(logData);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private long calculateUpgradeFee(long currentGold, MessageType type, Integer level) throws InfraNotExistException {
        long upgradeFee;
        switch (type) {
            case UPGRADE_WAREHOUSE: {
                Warehouse warehouse = warehouseRepository.findById(level).orElse(null);
                upgradeFee = warehouse != null ? warehouse.getWarehouseUpgradeFee() : -1;
                break;
            }
            case UPGRADE_BROKER: {
                Broker broker = brokerRepository.findById(level).orElse(null);
                upgradeFee = broker != null ? broker.getBrokerUpgradeFee() : -1;
                break;
            }
            case UPGRADE_VEHICLE: {
                Vehicle vehicle = vehicleRepository.findById(level).orElse(null);
                upgradeFee = vehicle != null ? vehicle.getVehicleUpgradeFee() : -1;
                break;
            }
            default: {
                upgradeFee = -1;
            }
        }
        if (upgradeFee == -1)
            return -1;
        return currentGold >= upgradeFee ? currentGold - upgradeFee : -1;
    }
}
