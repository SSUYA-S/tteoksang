package com.welcome.tteoksang.game.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.game.dto.*;
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
import com.welcome.tteoksang.user.dto.UserInfo;
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

    // 한턴에 살 수 있는 양
    private final int SERVERQUANTITY = 100;

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
        if (redisGameInfo != null) {
            // 유저가 가진 농산물 정보 불러오기
            // TODO: 서버에서 수량 제한을 여기서 설정

            // 초기 설정
            Map<Integer, UserProductInfo> products = redisGameInfo.getProducts();
            // 현재 소지 금액
            long remainGold = redisGameInfo.getGold();
            // 살 수 있는 수량
            int remainPurchaseQuantity = SERVERQUANTITY - redisGameInfo.getPurchaseQuantity();
            // 이번 턴에 산 농산물 개수
            int turnPurchaseQuantity = redisGameInfo.getPurchaseQuantity();
            // 남은 창고 공간
            Warehouse currentWarehouse = warehouseRepository.findById(redisGameInfo.getWarehouseLevel())
                    .orElseThrow(WarehouseNotExistException::new);
            int remainWarehouseQuantity = currentWarehouse.getWarehouseCapacity() - redisGameInfo.getTotalProductQuantity();
            // 창고에 있는 전체 수량
            int totalProductQuantity = redisGameInfo.getTotalProductQuantity();

            // 소지 금액, 구매 최대 수량, 창고 남은 수량, 을 넘어가면 롤백하기 위해 깊은 복사
            Map<Integer, UserProductInfo> pastProducts = new HashMap<>(products);
            long pastGold = redisGameInfo.getGold();
            int pastPurchaseQuantity = redisGameInfo.getPurchaseQuantity();
            int pastTotalProductQuantity = redisGameInfo.getTotalProductQuantity();

            try {
                // TODO: 클라이언트에서 구매한 농산물의 수량, 각 농산물의 총 가격 합을 보내줌 이걸 서버 가격으로 바꿔야 됨
                // body에 있는 구매 정보 파싱
                Map<Integer, UserProductInfo> messageProductsMap = getProductBody(body);

                // messageProductsMap를 순회
                for (Map.Entry<Integer, UserProductInfo> messageProduct : messageProductsMap.entrySet()) {
                    Integer messageProductId = messageProduct.getKey();
                    UserProductInfo messageProductInfo = messageProduct.getValue();

                    // 소지금보다 금액이 높으면, 한 턴에 구매할 수 있는 농산물 수량보다 높으면, 창고의 남은 자리가 없으면 구매불가, 롤백
                    if (remainGold < messageProductInfo.getProductTotalCost()
                            || remainPurchaseQuantity < messageProductInfo.getProductQuantity()
                            || remainWarehouseQuantity < messageProductInfo.getProductQuantity()
                    ) {
                        products = pastProducts;    // 과거 작물 정보
                        remainGold = pastGold;      // 과거 골드 정보
                        turnPurchaseQuantity = pastPurchaseQuantity;
                        totalProductQuantity = pastTotalProductQuantity;    // 과거 가지고 있는 전체 물량
                        isSuccess = false;
                        if (remainGold < messageProductInfo.getProductTotalCost())
                            log.error("구매 실패입니다.");
                        else if (remainPurchaseQuantity < messageProductInfo.getProductQuantity())
                            log.error("구매 제한을 넘습니다.");
                        else
                            log.error("창고에 남은 자리가 없습니다.");
                        break;
                    }

                    // 이미 가지고 있는 작물
                    if (products.containsKey(messageProductId)) {

                        // 레디스 내부에 저장된 나의 농산물 정보 갱신
                        UserProductInfo redisProductInfo = products.get(messageProductId);
                        redisProductInfo.setProductQuantity(redisProductInfo.getProductQuantity() + messageProductInfo.getProductQuantity());
                        redisProductInfo.setProductTotalCost(redisProductInfo.getProductTotalCost() + messageProductInfo.getProductTotalCost());
                        products.put(messageProductId, redisProductInfo);
                    }
                    // 새로운 작물 추가
                    else {
                        products.put(messageProductId, UserProductInfo.builder()
                                .productQuantity(messageProductInfo.getProductQuantity())
                                .productTotalCost(messageProductInfo.getProductTotalCost())
                                .build()
                        );
                    }

                    // 갱신
                    remainGold -= messageProductInfo.getProductTotalCost();
                    turnPurchaseQuantity += messageProductInfo.getProductQuantity();
                    remainPurchaseQuantity -= messageProductInfo.getProductQuantity();
                    remainWarehouseQuantity -= messageProductInfo.getProductQuantity();
                    totalProductQuantity += messageProductInfo.getProductQuantity();
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
                responseBody = SellProductInfo.builder()
                        .gold(redisGameInfo.getGold())
                        .productList(newProductList)
                        .build();
            } catch (Exception e) {
                log.error(e.getMessage());
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

        // 게임 정보가 있는 경우 판매
        if (redisGameInfo != null) {
            // 유저가 가진 농산물 정보 불러오기
            // TODO: 서버에서 수량 제한을 여기서 설정

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
            long pastProductTotalCost = 0;
            int pastTotalProductQuantity = redisGameInfo.getTotalProductQuantity();

            try {
                // TODO: 클라이언트에서 구매한 농산물의 수량, 각 농산물의 총 가격 합을 보내줌 이걸 서버 가격으로 바꿔야 됨
                // body에 있는 구매 정보 파싱
                Map<Integer, UserProductInfo> messageProductsMap = getProductBody(body);

                // messageProductsMap를 순회
                for (Map.Entry<Integer, UserProductInfo> messageProduct : messageProductsMap.entrySet()) {
                    // 메세지 내부 농산물 정보
                    Integer messageProductId = messageProduct.getKey();
                    UserProductInfo messageProductInfo = messageProduct.getValue();

                    // 메세지에 해당하는 작물이 있을때, 현재 가지고 있는 수량 안의 판매 요청 처리
                    if (!products.containsKey(messageProductId) ||
                            products.get(messageProductId).getProductQuantity() < messageProductInfo.getProductQuantity()) {

                        products = pastProducts;    // 과거 작물 정보
                        remainGold = pastGold;      // 과거 골드 정보
                        totalProductQuantity = pastTotalProductQuantity;    // 과거 가지고 있는 전체 물량
                        isSuccess = false;

                        if (!products.containsKey(messageProductId))
                            log.error("해당 작물 없음");
                        else if (products.get(messageProductId).getProductQuantity() < messageProductInfo.getProductQuantity())
                            log.error("작물이 부족합니다.");
                        break;
                    }
                    // 판매 처리
                    // 해당 농산물의 남은 수량
                    int remainQuantity = products.get(messageProductId).getProductQuantity() - messageProductInfo.getProductQuantity();
                    // 남은 전체 농산물 수량
                    totalProductQuantity -= messageProductInfo.getProductQuantity();

                    // 판매 후 금액
                    remainGold += ((long) messageProductInfo.getProductTotalCost() * (100 - productCharge)); //TODO: 서버 가격으러 변경해야 됨

                    // 해당 농산물의 총 금액
                    int productTotalCost = products.get(messageProductId).getProductTotalCost() - messageProductInfo.getProductTotalCost();

                    // product 반영
                    products.replace(messageProductId, UserProductInfo.builder().productQuantity(remainQuantity)
                            .productTotalCost(productTotalCost).build());
                }

                // 레디스 갱신
                redisGameInfo.setGold(remainGold);
                redisGameInfo.setProducts(products);
                redisGameInfo.setTotalProductQuantity(totalProductQuantity);

                redisService.setValues(redisGameInfoKey, redisGameInfo);

                List<ProductTradeInfo> newProductList = getProductList(products);
                // 메세지 바디에 모든 농산물 정보를 저장
                responseBody = BuyProductInfo.builder()
                        .gold(redisGameInfo.getGold())
                        .productList(newProductList)
                        .purchasedQuantity(redisGameInfo.getPurchaseQuantity())
                        .build();
            } catch (Exception e) {
                log.error(e.getMessage());
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
        if (redisGameInfo != null) {
            int nextWarehouseLevel = redisGameInfo.getWarehouseLevel() + 1;
            try {
                // 다음 레벨이 있는지 확인
                brokerRepository.findById(nextWarehouseLevel).orElseThrow(BrokerNotExistException::new);
                // 남은 금액 확인
                long remainGold = calculateUpgradeFee(redisGameInfo.getGold(), MessageType.UPGRADE_WAREHOUSE, nextWarehouseLevel);
                if (remainGold != -1) {
                    redisGameInfo.setGold(remainGold);
                    redisGameInfo.setWarehouseLevel(nextWarehouseLevel);

                    responseBody = UpgradeWarehouseInfo.builder()
                            .gold(redisGameInfo.getGold())
                            .warehouseLevel(redisGameInfo.getWarehouseLevel())
                            .build();

                    redisService.setValues(redisGameInfoKey, redisGameInfo);
                    isSuccess = true;
                } else {
                    log.debug("금액 부족");
                }
            } catch (WarehouseNotExistException e) {
                log.error("없는 창고 입니다.");
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
        if (redisGameInfo != null) {
            int nextBrokerLevel = redisGameInfo.getBrokerLevel() + 1;
            try {
                // 다음 레벨이 있는지 확인
                brokerRepository.findById(nextBrokerLevel).orElseThrow(BrokerNotExistException::new);
                // 남은 금액 확인
                long remainGold = calculateUpgradeFee(redisGameInfo.getGold(), MessageType.UPGRADE_BROKER, nextBrokerLevel);
                if (remainGold != -1) {
                    redisGameInfo.setGold(remainGold);
                    redisGameInfo.setBrokerLevel(nextBrokerLevel);

                    responseBody = UpgradeBrokerInfo.builder()
                            .gold(redisGameInfo.getGold())
                            .brokerLevel(redisGameInfo.getBrokerLevel())
                            .build();

                    redisService.setValues(redisGameInfoKey, redisGameInfo);
                    isSuccess = true;
                } else {
                    log.debug("금액 부족");
                }
            } catch (BrokerNotExistException e) {
                log.error("없는 환전소 입니다.");
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

                    responseBody = UpgradeVehicleInfo.builder()
                            .gold(redisGameInfo.getGold())
                            .vehicleLevel(redisGameInfo.getVehicleLevel())
                            .build();

                    redisService.setValues(redisGameInfoKey, redisGameInfo);
                } else {
                    log.debug("금액 부족");
                }
            } catch (VehicleNotExistException e) {
                log.error("없는 운송수단 입니다.");
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
