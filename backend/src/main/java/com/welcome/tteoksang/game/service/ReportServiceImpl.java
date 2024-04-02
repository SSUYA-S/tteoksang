package com.welcome.tteoksang.game.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.game.dto.result.quarter.OverdueProduct;
import com.welcome.tteoksang.game.dto.result.quarter.Quarter;
import com.welcome.tteoksang.game.dto.result.quarter.RentFeeInfo;
import com.welcome.tteoksang.game.dto.server.ServerProductInfo;
import com.welcome.tteoksang.game.dto.user.RedisGameInfo;
import com.welcome.tteoksang.game.dto.user.UserProductInfo;
import com.welcome.tteoksang.game.exception.BrokerNotExistException;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
import com.welcome.tteoksang.kafka.Message;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.dto.Broker;
import com.welcome.tteoksang.resource.repository.BrokerRepository;
import com.welcome.tteoksang.resource.type.MessageType;
import com.welcome.tteoksang.user.dto.UserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService{

    private final RedisService redisService;
    private final BrokerRepository brokerRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ServerInfo serverInfo;

    final double DISCOUNT_RATE = 100.0; // 할인율을 %로 표현


    // 계절 결산 불러오기
    public void sendQuarterResult(String userId, String webSocketId) {
        boolean isSuccess = true;
        Object responseBody = "";
        // 레디스에서 결산 데이터 불러오기
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        String userInfoKey = RedisPrefix.USERINFO.prefix() + userId;
        RedisGameInfo redisGameInfo = null;
        UserInfo userInfo = (UserInfo) redisService.getValues(userInfoKey);
        if (redisService.hasKey(redisGameInfoKey)) {
            redisGameInfo = (RedisGameInfo) redisService.getValues(redisGameInfoKey);
            RentFeeInfo rentFeeInfo = calculateRentFee(userId, redisGameInfo);
            responseBody = Quarter.builder()
                    .turn(serverInfo.getCurrentTurn())
                    .rentFeeInfo(rentFeeInfo)
                    .quarterProfit(0L)
                    .inProductList(new ArrayList<>())
                    .titleId(userInfo.getTitleId())
                    .build();
        }
        else {
            isSuccess = false;
        }

        GameMessageRes quarterResult = GameMessageRes.builder()
                .type(MessageType.QUARTER_REPORT)
                .isSuccess(isSuccess)
                .body(responseBody)
                .build();

        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, quarterResult);
    }

    private RentFeeInfo calculateRentFee(String userId, RedisGameInfo redisGameInfo) {
        RentFeeInfo rentFeeInfo;
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        Long redisGold = redisGameInfo.getGold();
        Long redisRentFee = redisGameInfo.getRentFee();
//        Long redisRentFee = 1000L;
        Long rentFee = redisGameInfo.getRentFee();
        // 레디스 안 나의 작물 정보
        Map<Integer, UserProductInfo> products = redisGameInfo.getProducts();
        // 순회를 할때 나의 작물 정보가 바뀌게 되면 오류가 발생하기 때문에 깊은 복사
        Map<Integer, UserProductInfo> copyProducts = redisGameInfo.getProducts();
        // 서버의 작물 정보
        Map<Integer, ServerProductInfo> serverProducts = serverInfo.getProductInfoMap();

        // 판매한 작물 목록
        List<OverdueProduct> overdueProductList = new ArrayList<>();

        // 창고에 들어간 물품 수
        int totalProductQuantity = redisGameInfo.getTotalProductQuantity();

        // 임대료 내기, 골드 갱신
        if(redisGold >= redisRentFee) {
            // 임대료 갱신
            redisGameInfo.setGold(redisGold - redisRentFee);
            redisGameInfo.setRentFee(0L);
            redisService.setValues(redisGameInfoKey,redisGameInfo);
            log.debug("임대료 정상 부과");
            rentFeeInfo = RentFeeInfo.builder()
                    .billType("basic")
                    .rentFee(redisRentFee)
                    .productList(new ArrayList<>())
                    .build();
        }
        // 가압류 및 파산
        else {
            // 가압류 및 파산 처리
            long remainRentFee = redisRentFee - redisGold; // 남은 임대료
            log.debug("계산 전 남은 임대료: {}", remainRentFee);
            redisGold = 0L; // 소지금은 모두 임대료에 사용
            // 파산
            boolean isBankrupt = true;

            // 수수료
            Broker currentBroker = brokerRepository.findById(redisGameInfo.getBrokerLevel())
                    .orElseThrow(BrokerNotExistException::new);
            int productCharge = currentBroker.getBrokerFeeRate();

            if(products != null) {
                // 순이익 최대로 레디스 정렬
                products.entrySet().stream()
                        .map(entry -> {
                            Integer productId = entry.getKey();
                            UserProductInfo userProductInfo = entry.getValue();
                            ServerProductInfo serverProductInfo = serverProducts.get(productId);

                            // 계산 실행
                            double value = (userProductInfo.getProductTotalCost().doubleValue() / userProductInfo.getProductQuantity()) - serverProductInfo.getProductCost();
                            return new AbstractMap.SimpleEntry<>(productId, value);
                        })
                        // 내림차순으로 정렬
                        .sorted(Collections.reverseOrder(Map.Entry.comparingByValue()))
                        .collect(Collectors.toList());
                log.debug("가격 정렬하기: {}",products);
                // products는 redis 안의 작물 정보
                // 순이익이 최대인 농산물부터 판매
                for (Map.Entry<Integer, UserProductInfo> rentFeeProduct : products.entrySet()) {
                    // 현재 작물
                    Integer productId = rentFeeProduct.getKey();
                    // 현재 각각의 나의 작물 정보
                    UserProductInfo productInfo = products.get(productId);

                    int sellQuantity = productInfo.getProductQuantity();  // 판매할 개수
                    int serverPrice = serverProducts.get(productId).getProductCost();
                    int serverProductCost = (int) Math.floor(serverProducts.get(productId)
                            .getProductCost() * (DISCOUNT_RATE - productCharge) / 100);  // 서버의 농산물 개당 가격

                    // 레디스에 있는 구매 총 가격
                    long redisProductTotalCost = productInfo.getProductTotalCost();

                    // 판매 처리
                    if ((double) remainRentFee / serverProductCost >= sellQuantity) {
                        // 판매한 작물
                        overdueProductList.add(OverdueProduct.builder()
                                .productId(rentFeeProduct.getKey())
                                .productQuantity(sellQuantity)
                                .build());
                        log.debug("다 판매한 작물번호: {}, 개수: {}, 개당 금액: {}", productId, sellQuantity, serverPrice);
                        // 다 팔기
                        // 평균 구매 단가 구하기
                        long calculateProductTotalCost = (long) (redisProductTotalCost -
                                Math.floor((double) redisProductTotalCost / productInfo.getProductQuantity())
                                        * sellQuantity);
                        productInfo.setProductTotalCost(calculateProductTotalCost);
                        productInfo.setProductQuantity(0);
                        // 남은 임대료
                        remainRentFee -= (long) serverProductCost * sellQuantity;
                        log.debug("남은 임대료: {}", remainRentFee);
                    } else {
                        // 일부만 판매한 경우
                        int soldQuantity = (int) Math.ceil((double) remainRentFee / serverProductCost);
                        // 판매한 작물
                        overdueProductList.add(OverdueProduct.builder()
                                .productId(rentFeeProduct.getKey())
                                .productQuantity(soldQuantity)
                                .build());

                        log.debug("다 판매하지 않은 작물번호: {}, 개수: {}, 금액: {}", productId, soldQuantity, serverPrice);
                        long totalSaleAmount = (long) serverProductCost * soldQuantity; // 이번 판매로 발생한 총 금액
                        remainRentFee -= totalSaleAmount; // 임대료를 충당

                        // 평균 구매 단가 구하기
                        long calculateProductTotalCost = (long) (redisProductTotalCost -
                                Math.floor((double) redisProductTotalCost / productInfo.getProductQuantity())
                                        * soldQuantity);
                        productInfo.setProductTotalCost(calculateProductTotalCost);
                        productInfo.setProductQuantity(productInfo.getProductQuantity() - soldQuantity);

                        log.debug("끝나기 전 남은 임대료: {}", remainRentFee);
                        if (remainRentFee <= 0) {
                            // 임대료를 초과하여 판매한 경우, 초과분을 소지금에 추가
                            long excess = -remainRentFee; // remainRentFee는 음수 또는 0이 될 수 있음
                            redisGold += excess; // 초과분 충당
                            remainRentFee = 0L; // 임대료 완전 충당
                        }
                        isBankrupt = false;
                        break; // 임대료를 모두 충당했으므로 반복 중단
                    }
                }
            }

            // 레디스 갱신
            redisGameInfo.setGold(redisGold);
            redisGameInfo.setProducts(products);
            redisGameInfo.setTotalProductQuantity(totalProductQuantity);
            redisGameInfo.setRentFee(remainRentFee);

            redisService.setValues(redisGameInfoKey, redisGameInfo);

            if(isBankrupt){
                log.debug("파산!!!");
                rentFeeInfo = RentFeeInfo.builder()
                        .billType("bankrupt")
                        .rentFee(0L)
                        .productList(new ArrayList<>())
                        .build();
            }
            // 가압류 - 순이익이 최대로
            else{
                log.debug("가압류!!");
                rentFeeInfo = RentFeeInfo.builder()
                        .billType("overdue")
                        .rentFee(rentFee)
                        .productList(overdueProductList)
                        .build();
                log.debug("압류된 정보: {}", overdueProductList.toString());
            }
        }
        return rentFeeInfo;
    }
}
