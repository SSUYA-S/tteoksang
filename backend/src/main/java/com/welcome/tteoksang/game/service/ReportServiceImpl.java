package com.welcome.tteoksang.game.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.game.dto.log.LogMessage;
import com.welcome.tteoksang.game.dto.log.RentFeeLogInfo;
import com.welcome.tteoksang.game.dto.log.SellLogInfo;
import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.game.dto.result.*;
import com.welcome.tteoksang.game.dto.result.half.*;
import com.welcome.tteoksang.game.dto.result.offline.OfflineReport;
import com.welcome.tteoksang.game.dto.result.quarter.OverdueProduct;
import com.welcome.tteoksang.game.dto.result.quarter.Quarter;
import com.welcome.tteoksang.game.dto.result.quarter.RentFeeInfo;
import com.welcome.tteoksang.game.dto.server.ServerProductInfo;
import com.welcome.tteoksang.game.dto.user.RedisGameInfo;
import com.welcome.tteoksang.game.dto.user.UserProductInfo;
import com.welcome.tteoksang.game.exception.BrokerNotExistException;
import com.welcome.tteoksang.game.repository.SeasonHalfPrivateStatisticsRepository;
import com.welcome.tteoksang.game.repository.SeasonHalfStatisticsRepository;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.dto.Broker;
import com.welcome.tteoksang.resource.repository.BrokerRepository;
import com.welcome.tteoksang.resource.repository.ProductRepository;
import com.welcome.tteoksang.resource.type.MessageType;
import com.welcome.tteoksang.resource.type.ProductType;
import com.welcome.tteoksang.user.dto.UserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final RedisService redisService;
//    private final SeasonHalfPrivateStatisticsService seasonHalfPrivateStatisticsService;
//    private final SeasonHalfStatisticsService seasonHalfStatisticsService;
    private final SeasonHalfPrivateStatisticsRepository seasonHalfPrivateStatisticsRepository;
    private final SeasonHalfStatisticsRepository seasonHalfStatisticsRepository;
    private final BrokerRepository brokerRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ProductRepository productRepository;
    private final ServerInfo serverInfo;
    private final Rank severRank;


    @Value("${RENT_FEE}")
    private long rentFee;
    @Value("${QUARTER_YEAR_TURN_PERIOD}")
    private int quarterYearTurnPeriod;

    //TODO- 환경변수를 어디 스태틱처럼 두고 쓰는게 낫나? 아니면 하나 싱글톤이든?
    final double DISCOUNT_RATE = 100.0; // 할인율을 %로 표현


    // 계절 결산 불러오기
    @Override
    public GameMessageRes sendQuarterResult(String userId) {
        boolean isSuccess = true;
        Object responseBody = "";
        // 레디스에서 결산 데이터 불러오기
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        String userInfoKey = RedisPrefix.USERINFO.prefix() + userId;
        RedisGameInfo redisGameInfo;
        UserInfo userInfo = (UserInfo) redisService.getValues(userInfoKey);
        if (redisService.hasKey(redisGameInfoKey)) {
            redisGameInfo = (RedisGameInfo) redisService.getValues(redisGameInfoKey);
            // 결산 데이터
            RentFeeInfo rentFeeInfo = calculateRentFee(userId, redisGameInfo);

            // 현재 계절정보
            ProductType seasonName = ProductType.values()[serverInfo.getCurrentTurn() % 4];
            List<Integer> products = productRepository.findProductIdsByProductType(seasonName);
            responseBody = Quarter.builder()
                    .turn(serverInfo.getCurrentTurn())
                    .gold(redisGameInfo.getGold())
                    .rentFeeInfo(rentFeeInfo)
                    .quarterProfit(redisGameInfo.getGold() - redisGameInfo.getLastQuarterGold())  // TODO: redis에 추가 필요
                    .inProductList(products)
                    .titleId(userInfo.getTitleId())
                    .build();
            if(rentFeeInfo.getBillType().equals("bankrupt")){
                // 레디스 지우기
                redisService.deleteValues(redisGameInfoKey);
            }
            else {
                // 갱신된 레디스 정보의 이전 골드 반영
                redisGameInfo = (RedisGameInfo) redisService.getValues(redisGameInfoKey);
                redisGameInfo.setLastQuarterGold(redisGameInfo.getGold());
                redisService.setValues(redisGameInfoKey, redisGameInfo);
            }
        } else {
            log.debug("오류 발생");
            isSuccess = false;
        }

        GameMessageRes quarterResult = GameMessageRes.builder()
                .type(MessageType.QUARTER_REPORT)
                .isSuccess(isSuccess)
                .body(responseBody)
                .build();
        return  quarterResult;
    }

    @Override
    public GameMessageRes sendHalfResult(String userId) {
        boolean isSuccess = true;
        Object responseBody = "";

        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        // 레디스에서 데이터 불러오기
        if (redisService.hasKey(redisGameInfoKey)) {
            // 레디스 정보
            RedisGameInfo redisGameInfo = (RedisGameInfo) redisService.getValues(redisGameInfoKey);
            int turn = serverInfo.getCurrentTurn();
            long gold = redisGameInfo.getGold();

            // 계절 결산 내용
            GameMessageRes quarterResult = sendQuarterResult(userId);
            // 계절 정보 가져오기
            Quarter quarter = (Quarter) quarterResult.getBody();

            // 계절 결산의 내용의 Rentfee를 그대로 사용
            RentFeeInfo rentFeeInfo = quarter.getRentFeeInfo();

            // 몽고 디비 키 생성
            String mongoDBKey = serverInfo.getSeasonId() + (turn/quarterYearTurnPeriod * 2)
                    + userId + redisGameInfo.getGameId();

            // 통계량 조회
            SeasonHalfPrivateStatistics halfPrivateStatistics
                    = seasonHalfPrivateStatisticsRepository.findById(mongoDBKey).orElseThrow(RuntimeException::new);
            SeasonHalfStatistics halfStatistics
                    = seasonHalfStatisticsRepository.findById(mongoDBKey).orElseThrow(RuntimeException::new);


            // 몽고 디비에서 데이터 불러오기
            long totalProductIncome = halfPrivateStatistics.getTotalAccPrivateProductIncome(); //ReduceProductInfo
            long totalProductOutcome = halfPrivateStatistics.getTotalAccPrivateProductOutcome();    //ReduceProductInfo
            long totalBrokerFee = halfPrivateStatistics.getTotalAccPrivateBrokerFee();  //ReduceProductInfo
            long totalUpgradeFee = halfPrivateStatistics.getAccPrivateUpgradeFee();    //ReduceStatistics
            long totalRentFee = halfPrivateStatistics.getAccPrivateRentFee();  //ReduceStatistics
            long eventBonus = halfPrivateStatistics.getAccPrivateEventBonus(); //ReduceStatistics
            int participantCount = halfStatistics.getAccGamePlayCount(); // ReduceStatistics

            // 나의 랭킹 정보
            List<RankInfo> myRankInfo = findMyRankInfo(halfPrivateStatistics, userId);

            // 떡락/떡상
            TteoksangStatistics tteoksangStatistics = halfStatistics.getTteoksangStatistics();
            TteokrockStatistics tteokrockStatistics = halfStatistics.getTteokrockStatistics();

            // 제일 많이 팔린 작물, 제일 적게 팔린 작물
            BestSellerStatistics bestSellerStatistics = halfStatistics.getBestSellerStatistics();

            // achievementList 빈 배열 보내기
            List<Integer> achievementList = new ArrayList<>();

            responseBody = Half.builder()
                    .turn(turn)
                    .gold(gold)
                    .rentFeeInfo(rentFeeInfo)
                    .quarterReport(quarter)
                    .totalProductIncome(totalProductIncome)
                    .totalProductOutcome(totalProductOutcome)
                    .totalBrokerFee(totalBrokerFee)
                    .totalUpgradeFee(totalUpgradeFee)
                    .totalRentFee(totalRentFee)
                    .eventBonus(eventBonus)
                    .participantCount(participantCount).
                    rankInfoList(myRankInfo)
                    .tteoksangStatistics(tteoksangStatistics)
                    .tteokrockStatistics(tteokrockStatistics)
                    .bestSellerStatistics(bestSellerStatistics)
                    .achievementList(achievementList)
                    .build();
        } else {
            log.debug("오류 발생");
            isSuccess = false;
        }

        // 랭킹 초기화
        severRank.getSellerbrityRank().clear();
        severRank.getMillionaireRank().clear();
        severRank.getTteoksangRank().clear();

        return GameMessageRes.builder()
                .type(MessageType.QUARTER_REPORT)
                .isSuccess(isSuccess)
                .body(responseBody)
                .build();
    }




    private RentFeeInfo calculateRentFee(String userId, RedisGameInfo redisGameInfo) {
        RentFeeInfo rentFeeInfo;

        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        Long redisGold = redisGameInfo.getGold();
        Long redisRentFee = redisGameInfo.getRentFee();
//        Long redisRentFee = 1000L;
        Long rentFee = redisGameInfo.getRentFee();

        // 초기 정보
        Map<Integer, UserProductInfo> products = redisGameInfo.getProducts(); // 레디스 안 나의 작물 정보
        Map<Integer, UserProductInfo> copyProducts = new HashMap<>(products);

        Map<Integer, ServerProductInfo> serverProducts = serverInfo.getProductInfoMap(); // 서버의 작물 정보
        List<OverdueProduct> overdueProductList = new ArrayList<>(); // 판매한 작물 목록
        int totalProductQuantity = redisGameInfo.getTotalProductQuantity(); // 창고에 들어간 물품 수

        // 임대료 내기, 골드 갱신
        if (redisGold >= redisRentFee) {
            // 임대료 갱신
            redisGameInfo.setGold(redisGold - redisRentFee);
            redisGameInfo.setRentFee(0L);
            redisService.setValues(redisGameInfoKey, redisGameInfo);
            log.debug("임대료 정상 부과 - {}, {}", redisGold, redisGameInfo.getGold());

            sendRentFeeLog(userId, redisGameInfo, rentFee);

            // 메세지 작성
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

            if (!products.isEmpty()) {
                // 순이익 최대로 레디스 정렬
                sortProducts(products, serverProducts);
                log.debug("가격 정렬하기: {}", products);

                // 로그에 사용되는 변수 선언
                long logProductIncome, logProductProfit;
                int logSoldQuantity;

                // products는 redis 안의 작물 정보 - 순이익이 최대인 농산물부터 판매
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
                        // 로그 정보
                        logProductIncome = (long) serverPrice * sellQuantity;
                        logProductProfit = (long) serverProductCost * sellQuantity;
                        logSoldQuantity = sellQuantity;

                        sendSellLog(userId, redisGameInfo, productId, logProductIncome, logSoldQuantity, logProductProfit, serverPrice);

                        productInfo.setProductTotalCost(calculateProductTotalCost);
                        productInfo.setProductQuantity(0);

                        copyProducts.remove(productId);

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
                        // 로그 정보
                        logProductIncome = (long) serverPrice * soldQuantity;
                        logProductProfit = (long) serverProductCost * soldQuantity;
                        logSoldQuantity = soldQuantity;

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

                        // 로그 저장
                        sendSellLog(userId, redisGameInfo, productId, logProductIncome, logSoldQuantity, logProductProfit, serverPrice);

                        copyProducts.put(productId, UserProductInfo.builder()
                                .productQuantity(productInfo.getProductQuantity() - soldQuantity)
                                .productPurchaseQuantity(productInfo.getProductPurchaseQuantity())
                                .productTotalCost(calculateProductTotalCost)
                                .build()
                        );
                        break; // 임대료를 모두 충당했으므로 반복 중단
                    }
                }
            }

            // 레디스 갱신
            redisGameInfo.setGold(redisGold);
//            redisGameInfo.setProducts(products);
            redisGameInfo.setProducts(copyProducts);
            redisGameInfo.setTotalProductQuantity(totalProductQuantity);
            redisGameInfo.setRentFee(remainRentFee);

            redisService.setValues(redisGameInfoKey, redisGameInfo);

            if (isBankrupt) {
                sendRentFeeLog(userId, redisGameInfo, rentFee);

                log.debug("파산!!!");
                rentFeeInfo = RentFeeInfo.builder()
                        .billType("bankrupt")
                        .rentFee(rentFee)
                        .productList(new ArrayList<>())
                        .build();
            }
            // 가압류 - 순이익이 최대로
            else {
                sendRentFeeLog(userId, redisGameInfo, rentFee);

                log.debug("가압류!!");
                rentFeeInfo = RentFeeInfo.builder()
                        .billType("overdue")
                        .rentFee(rentFee)
                        .productList(overdueProductList)
                        .build();
                log.debug("압류된 정보: {}", overdueProductList);
            }
        }
        return rentFeeInfo;
    }

    // 최대 이익순 정렬
    private void sortProducts(Map<Integer, UserProductInfo> products, Map<Integer, ServerProductInfo> serverProducts) {
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
    }

    // 랭킹 구하기
    private List<RankInfo> findMyRankInfo(SeasonHalfPrivateStatistics halfPrivateStatistics, String userId) {
        List<RankInfo> rankInfoList = new ArrayList<>();
        // 나의 랭킹 뽑기
        List<Sellerbrity> sellerbrityRank = severRank.getSellerbrityRank();
        int mySellerbrityRank = sellerbrityRank.size();
        for (int i = 0; i < sellerbrityRank.size(); i++) {
            Sellerbrity sellerbrity = sellerbrityRank.get(i);
            if (sellerbrity.getUserId().equals(userId)) {
                mySellerbrityRank = i + 1; // 등수는 1부터 시작하므로, 인덱스 + 1
                break; // 찾았으므로 반복문 종료
            }
        }

        // 1등 유저 정보
        String userInfoKey = RedisPrefix.USERINFO.prefix() + sellerbrityRank.get(0).getUserId();
        UserInfo sellerbrityUserInfo = (UserInfo) redisService.getValues(userInfoKey);

        TheFirstUserInfo theFirstSellerbrityUserInfo = TheFirstUserInfo.builder()
                .userNickname(sellerbrityUserInfo.getNickname())
                .profileFrameId(sellerbrityUserInfo.getProfileFrameId())
                .profileIconId(sellerbrityUserInfo.getProfileIconId())
                .build();

        rankInfoList.add(RankInfo.builder()
                .rankName("판매왕")
                .rankDescription("가장 많은 순수익을 얻은 사람(반기 기준)")
                .theFirstUserInfo(theFirstSellerbrityUserInfo)
                .theFirstRecord(sellerbrityRank.get(0).getTotalAccPrivateProductProfit())
                .myRank(mySellerbrityRank)
                .myRecord(halfPrivateStatistics.getTotalAccPrivateProductProfit())
                .build());

        // 부자
        List<Millionaire> millionaireRank = severRank.getMillionaireRank();
        int myMillionaireRank = millionaireRank.size();
        for (int i = 0; i < millionaireRank.size(); i++) {
            Millionaire millionaire = millionaireRank.get(i);
            if (millionaire.getUserId().equals(userId)) {
                myMillionaireRank = i + 1; // 등수는 1부터 시작하므로, 인덱스 + 1
                break; // 찾았으므로 반복문 종료
            }
        }

        // 1등 유저 정보
        userInfoKey = RedisPrefix.USERINFO.prefix() + millionaireRank.get(0).getUserId();
        UserInfo millionairUserInfo = (UserInfo) redisService.getValues(userInfoKey);

        TheFirstUserInfo theFirstMillionairUserInfo = TheFirstUserInfo.builder()
                .userNickname( millionairUserInfo.getNickname())
                .profileFrameId( millionairUserInfo.getProfileFrameId())
                .profileIconId( millionairUserInfo.getProfileIconId())
                .build();

        String userKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        RedisGameInfo redisGameInfo = (RedisGameInfo) redisService.getValues(userKey);

        rankInfoList.add(RankInfo.builder()
                .rankName("부자")
                .rankDescription("현재 보유 금액")
                .theFirstUserInfo(theFirstMillionairUserInfo)
                .theFirstRecord(millionaireRank.get(0).getGold())
                .myRank(myMillionaireRank)
                .myRecord(redisGameInfo.getGold())
                .build());

        // 떡상
        List<Tteoksang> tteoksangRank = severRank.getTteoksangRank();
        int myTteoksangRank = tteoksangRank.size();
        for (int i = 0; i < tteoksangRank.size(); i++) {
            Tteoksang tteoksang = tteoksangRank.get(i);
            if (tteoksang.getUserId().equals(userId)) {
                myTteoksangRank = i + 1; // 등수는 1부터 시작하므로, 인덱스 + 1
                break; // 찾았으므로 반복문 종료
            }
        }
        // 1등 유저 정보
        userInfoKey = RedisPrefix.USERINFO.prefix() + tteoksangRank.get(0).getUserId();
        UserInfo tteoksangUserInfo = (UserInfo) redisService.getValues(userInfoKey);

        TheFirstUserInfo theFirstTteoksangUserInfo = TheFirstUserInfo.builder()
                .userNickname(tteoksangUserInfo.getNickname())
                .profileFrameId(tteoksangUserInfo.getProfileFrameId())
                .profileIconId(tteoksangUserInfo.getProfileIconId())
                .build();

        rankInfoList.add(RankInfo.builder()
                .rankName("떡상")
                .rankDescription("가장 높은 수익률(반기 기준)")
                .theFirstUserInfo(theFirstTteoksangUserInfo)
                .theFirstRecord(tteoksangRank.get(0).getProfitGold())
                .myRank(myTteoksangRank)
                .myRecord(redisGameInfo.getGold() - redisGameInfo.getLastQuarterGold())
                .build());

        return rankInfoList;
    }

    private void sendSellLog(String userId, RedisGameInfo redisGameInfo, Integer productId, long logProductIncome, int logSoldQuantity, long logProductProfit, int serverPrice) {
        // 로그 저장
        SellLogInfo logInfo = SellLogInfo.builder()
                .seasonId(serverInfo.getSeasonId())
                .userId(userId)
                .gameId(redisGameInfo.getGameId())
                .turn(serverInfo.getCurrentTurn())
                .productId(productId)
                .productIncome(logProductIncome)
                .soldQuantity(logSoldQuantity)
                .brokerFee((int) (logProductIncome - logProductProfit))
                .productProfit(logProductProfit)
                .productCost(serverPrice)
                .build();

        LogMessage logMessage = LogMessage.builder()
                .type("SELL")
                .body(logInfo)
                .build();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String logData = objectMapper.writeValueAsString(logMessage);
            log.debug(logData);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private void sendRentFeeLog(String userId, RedisGameInfo redisGameInfo, Long rentFee) {
        // 로그 찍기
        RentFeeLogInfo logInfo = RentFeeLogInfo.builder()
                .seasonId(serverInfo.getSeasonId())
                .gameId(redisGameInfo.getGameId())
                .userId(userId)
                .turn(serverInfo.getCurrentTurn())
                .rentFee(rentFee)
                .build();

        LogMessage logMessage = LogMessage.builder()
                .type("RENT_FEE")
                .body(logInfo)
                .build();

        printLog(logMessage);
    }

    private void printLog(LogMessage logMessage) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String logData = objectMapper.writeValueAsString(logMessage);
            log.debug(logData);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendHalfReportStatistics(int halfYearNumber) {

    }

    public void sendHalfReport(String userId) {


    }

    public OfflineReport searchOfflineReport(String userId) {
        String gameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        RedisGameInfo gameInfo = (RedisGameInfo) redisService.getValues(gameInfoKey);
        //접속 안 한 사이 밀린 rentFee를 계산
        int lastPlayTurn = gameInfo.getLastPlayTurn();
        gameInfo.setLastPlayTurn(serverInfo.getCurrentTurn());
        if (serverInfo.getCurrentTurn() / quarterYearTurnPeriod == lastPlayTurn / quarterYearTurnPeriod) {
            //미접속 결산 할 게 없다! -> isSuccess=false
            gameInfo.setRentFee((serverInfo.getCurrentTurn() - lastPlayTurn) * gameInfo.getTotalProductQuantity() * rentFee);
            redisService.setValues(gameInfoKey, gameInfo);
            return null;
        }
        // 미접속 결산할 것이 있다!

        //(계절이 안 지났으므로) 아직 정산시키지 않을 턴 수: 현재 턴은 아직 진행중이므로 제외
        int unCalculateOfflineTurn = serverInfo.getCurrentTurn() % quarterYearTurnPeriod - 1;
        //정산해야 할 턴 수
        int calculateOfflineTurn = serverInfo.getCurrentTurn() - unCalculateOfflineTurn - lastPlayTurn;
        long offlineRentFee = calculateOfflineTurn * gameInfo.getTotalProductQuantity() * rentFee;
        gameInfo.setRentFee(gameInfo.getRentFee() + offlineRentFee);
        redisService.setValues(gameInfoKey, gameInfo);

        //TODO- 계절결산을 받아온다
        Quarter quarter=Quarter.builder().build();
        OfflineReport offlineReport=OfflineReport.builder()
                .lastGameTurn(lastPlayTurn)
                .quarterReport(quarter)
                .gold(quarter.getGold())
                .rentFeeInfo(quarter.getRentFeeInfo())
                .build();

        gameInfo.setRentFee(unCalculateOfflineTurn * gameInfo.getTotalProductQuantity() * rentFee);
        redisService.setValues(gameInfoKey, gameInfo);
        int halfYearOfLastPlayTurn = serverInfo.getCurrentTurn() / (quarterYearTurnPeriod * 2);
        int halfYearOfCurrentTurn = serverInfo.getCurrentTurn() / (quarterYearTurnPeriod * 2);
        if (halfYearOfLastPlayTurn == halfYearOfCurrentTurn) {
            //계절 결산만 있다
            //현재 계절에 대한 정보 제공
            return offlineReport;
        }
        //TODO- 반기결산을 받아온다
        Half half= Half.builder().build();
        if (halfYearOfCurrentTurn - halfYearOfLastPlayTurn == 1) {
            //반기 하나만 차이난다
            //반기 하나에 대한 정보만 제공 => halfReport==recentHalfReport
            offlineReport.setHalfReport(half);
            return offlineReport;
        }
        //이전 플레이 반기와, 최근 반기에 대한 정보 제공
        Half recentHalf= Half.builder().build();
        offlineReport.setRecentHalfReport(recentHalf);
        return offlineReport;
    }
}
