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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportServiceImpl {

    private final RedisService redisService;
    private final BrokerRepository brokerRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ServerInfo serverInfo;

    final double DISCOUNT_RATE = 100.0; // 할인율을 %로 표현

    /**
     *
     * @param userId
     * @param webSocketId
     * {
     *     "turn": 361,
     *     "rentFeeInfo": {
     *         "billType": "overdue",
     *         "rentFee": 10000,
     *         "productList": [
     *             {
     *                 "productId": 2,
     *                 "productQuantity": 20
     *             },
     *             {
     *                 "productId": 3,
     *                 "productQuantity": 5
     *             }
     *         ]
     *     },
     *     "quarterProfit": 1000000,
     *     "rentFee": 10000,
     *     "inProductList": [3, 4, 5, 7, 8],
     *     "titleId": 1
     * }
     */

    // 계절 결산 불러오기
    public void sendQuaterResult(String userId, String webSocketId) {
//        boolean isSuccess = true;
//        Object responseBody = "";
//        // 레디스에서 결산 데이터 불러오기
//        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
//        RedisGameInfo redisGameInfo = null;
//        if (redisService.hasKey(redisGameInfoKey)) {
//            redisGameInfo = (RedisGameInfo) redisService.getValues(redisGameInfoKey);
//            RentFeeInfo rentFeeInfo = calculateRentFee(userId, redisGameInfo);
//            responseBody = Quarter.builder()
//                    .turn(serverInfo.getCurrentTurn())
//                    .rentFeeInfo(rentFeeInfo)
//                    .quarterProfit()
//                    .inProductList()
//                    .titleId()
//                    .build();
//        }
//        else {
//            isSuccess = false;
//        }
        String logData = "{\n" +
                "    \"turn\": 361,\n" +
                "    \"rentFeeInfo\": {\n" +
                "        \"billType\": \"overdue\",\n" +
                "        \"rentFee\": 10000,\n" +
                "        \"productList\": [\n" +
                "            {\n" +
                "                \"productId\": 2,\n" +
                "                \"productQuantity\": 20\n" +
                "            },\n" +
                "            {\n" +
                "                \"productId\": 3,\n" +
                "                \"productQuantity\": 5\n" +
                "            }\n" +
                "        ]\n" +
                "    },\n" +
                "    \"quarterProfit\": 1000000,\n" +
                "    \"rentFee\": 10000,\n" +
                "    \"inProductList\": [3, 4, 5, 7, 8],\n" +
                "    \"titleId\": 1\n" +
                "}";
        ObjectMapper mapper = new ObjectMapper();
        boolean isSuccess = false;
        Message message = null;
        try {
            message = mapper.readValue(logData, Message.class);
            log.debug("Type: {}", message.getType());
            isSuccess = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        GameMessageRes quarterResult = GameMessageRes.builder()
                .type(MessageType.QUARTER_REPORT)
                .isSuccess(isSuccess)
                .body(message.getBody())
                .build();

        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, quarterResult);
    }

//    private RentFeeInfo calculateRentFee(String userId, RedisGameInfo redisGameInfo) {
//        RentFeeInfo rentFeeInfo;
//        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
//        Long redisGold = redisGameInfo.getGold();
//        Long redisRentFee = redisGameInfo.getRentFee();
//        // 레디스 안 나의 작물 정보
//        Map<Integer, UserProductInfo> products = redisGameInfo.getProducts();
//        // 서버의 작물 정보
//        Map<Integer, ServerProductInfo> serverProducts = serverInfo.getProductInfoMap();
//
//        // 판매한 작물 목록
//        List<OverdueProduct> overdueProductList = new ArrayList<>();
//
//        // 창고에 들어간 물품 수
//        int totalProductQuantity = redisGameInfo.getTotalProductQuantity();
//
//        // 임대료 내기, 골드 갱신
//        if(redisGold >= redisRentFee) {
//            // 임대료 갱신
//            redisGameInfo.setGold(redisGold - redisRentFee);
//            redisGameInfo.setRentFee(0L);
//            redisService.setValues(redisGameInfoKey,redisGameInfo);
//
//            rentFeeInfo = RentFeeInfo.builder()
//                    .billType("basic")
//                    .rentFee(redisRentFee)
//                    .productList(new ArrayList<>())
//                    .build();
//        }
//        // 가압류 및 파산
//        else {
//            // 가압류 및 파산 처리
//            Long remainRentFee = redisRentFee - redisGold; // 남은 임대료
//            redisGold = 0L; // 소지금은 모두 임대료에 사용
//            // 파산
//            boolean isBankrupt = products == null || products.isEmpty();
//
//
//            // 수수료
//            Broker currentBroker = brokerRepository.findById(redisGameInfo.getBrokerLevel())
//                    .orElseThrow(BrokerNotExistException::new);
//            int productCharge = currentBroker.getBrokerFeeRate();
//
//            // 순이익 최대로 레디스 정렬
//            products.entrySet().stream()
//                    .map(entry -> {
//                        Integer productId = entry.getKey();
//                        UserProductInfo userProductInfo = entry.getValue();
//                        ServerProductInfo serverProductInfo = serverProducts.get(productId);
//
//                        // 계산 실행
//                        double value = (userProductInfo.getProductTotalCost().doubleValue() / userProductInfo.getProductQuantity()) - serverProductInfo.getProductCost();
//                        return new AbstractMap.SimpleEntry<>(productId, value);
//                    })
//                    // 내림차순으로 정렬
//                    .sorted(Collections.reverseOrder(Map.Entry.comparingByValue()))
//                    .collect(Collectors.toList());
//
//            // products는 redis 안의 작물 정보
//            // 순이익이 최대인 농산물부터 판매
//            for (Map.Entry<Integer, UserProductInfo> rentFeeProduct : products.entrySet()) {
//                Integer productId = rentFeeProduct.getKey();
//                // 현재 각각의 나의 작물 정보
//                UserProductInfo productInfo = products.get(productId);
//
//                int sellQuantity = productInfo.getProductQuantity();  // 판매할 개수
//                int serverProductCost = (int) Math.floor(serverProducts.get(productId)
//                        .getProductCost() * (DISCOUNT_RATE - productCharge) / 100);  // 서버의 농산물 개당 가격
//
//                // 레디스에 있는 구매 총 가격
//                long redisProductTotalCost = productInfo.getProductTotalCost();
//
//                // 판매 처리
//                if (remainRentFee / serverProductCost >= sellQuantity) {
//                    // 판매한 작물
//                    overdueProductList.add(OverdueProduct.builder()
//                            .productId(rentFeeProduct.getKey())
//                            .productQuantity(sellQuantity)
//                            .build());
//                    // 다 팔기
//                    // 평균 구매 단가 구하기
//                    long calculateProductTotalCost = (long) (redisProductTotalCost -
//                            Math.floor((double) redisProductTotalCost / productInfo.getProductQuantity())
//                                    * sellQuantity);
//                    productInfo.setProductTotalCost(calculateProductTotalCost);
//                    productInfo.setProductQuantity(0);
//                    // 남은 임대료
//                    remainRentFee -= (long) serverProductCost * sellQuantity;
//
//                    // product 반영
//                    products.replace(productId, UserProductInfo.builder()
//                            .productQuantity(0)
//                            .productPurchaseQuantity(redisProductInfo.getProductPurchaseQuantity())
//                            .productTotalCost(calculateProductTotalCost)
//                            .build()
//                    );
//                } else {
//                    // 일부만 판매한 경우
//                    int soldQuantity = (int) (remainRentFee / serverProductCost);
//                    // 판매한 작물
//                    overdueProductList.add(OverdueProduct.builder()
//                            .productId(rentFeeProduct.getKey())
//                            .productQuantity(soldQuantity)
//                            .build());
//                    long totalSaleAmount = (long) serverProductCost * soldQuantity; // 이번 판매로 발생한 총 금액
//                    remainRentFee -= totalSaleAmount; // 임대료를 충당
//
//                    // 평균 구매 단가 구하기
//                    long calculateProductTotalCost = (long) (redisProductTotalCost -
//                            Math.floor((double) redisProductTotalCost / productInfo.getProductQuantity())
//                                    * soldQuantity);
//                    productInfo.setProductTotalCost(calculateProductTotalCost);
//
//                    productInfo.setProductQuantity(productInfo.getProductQuantity() - soldQuantity);
//
//                    if (remainRentFee <= 0) {
//                        // 임대료를 초과하여 판매한 경우, 초과분을 소지금에 추가
//                        long excess = -remainRentFee; // remainRentFee는 음수 또는 0이 될 수 있음
//                        redisGold += excess; // 초과분 충당
//                        remainRentFee = 0L; // 임대료 완전 충당
//                    }
//
//                    // product 반영
//                    products.replace(productId, UserProductInfo.builder()
//                            .productQuantity(remainQuantity)
//                            .productPurchaseQuantity(redisProductInfo.getProductPurchaseQuantity())
//                            .productTotalCost(calculateProductTotalCost)
//                            .build()
//                    );
//                    break; // 임대료를 모두 충당했으므로 반복 중단
//                }
//                if (remainRentFee <= 0) {
//                    isBankrupt = false;
//                    break;
//                }
//            }
//            // 레디스 갱신
//            redisGameInfo.setGold(redisGold);
//            redisGameInfo.setProducts(products);
//            redisGameInfo.setTotalProductQuantity(totalProductQuantity);
//            redisGameInfo.setRentFee(remainRentFee);
//
//
//            if(isBankrupt){
//                rentFeeInfo = RentFeeInfo.builder()
//                        .billType("bankrupt")
//                        .rentFee(0L)
//                        .productList(new ArrayList<>())
//                        .build();
//            }
//            // 가압류 - 순이익이 최대로
//            else{
//                rentFeeInfo = RentFeeInfo.builder().build();
//            }
//        }
//        return rentFeeInfo;
//    }
}
