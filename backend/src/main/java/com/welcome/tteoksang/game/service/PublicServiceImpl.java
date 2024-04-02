package com.welcome.tteoksang.game.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.game.dto.*;
import com.welcome.tteoksang.game.dto.event.Article;
import com.welcome.tteoksang.game.dto.event.BreakTimeInfo;
import com.welcome.tteoksang.game.dto.log.LogMessage;
import com.welcome.tteoksang.game.dto.log.SpecialEventLogInfo;
import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.game.dto.event.NewsInfo;
import com.welcome.tteoksang.game.dto.event.PublicEventInfo;
import com.welcome.tteoksang.game.dto.server.FluctationInfo;
import com.welcome.tteoksang.game.dto.server.ServerProductInfo;
import com.welcome.tteoksang.game.dto.server.ServerSeasonInfo;
import com.welcome.tteoksang.game.dto.user.PlayTimeInfo;
import com.welcome.tteoksang.game.exception.AccessToInvalidWebSocketIdException;
import com.welcome.tteoksang.game.exception.CurrentTurnNotInNormalRangeException;
import com.welcome.tteoksang.game.exception.EventNotFoundException;
import com.welcome.tteoksang.game.exception.ProductFluctuationNotFoundException;
import com.welcome.tteoksang.game.repository.ProductFluctuationRepository;
import com.welcome.tteoksang.game.repository.ServerSeasonInfoRepository;
import com.welcome.tteoksang.game.scheduler.ScheduleService;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.dto.Event;
import com.welcome.tteoksang.resource.repository.EventRepository;
import com.welcome.tteoksang.resource.repository.ProductRepository;
import com.welcome.tteoksang.resource.type.MessageType;
import com.welcome.tteoksang.resource.type.ProductType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@Validated
@RequiredArgsConstructor
public class PublicServiceImpl implements PublicService, PrivateGetPublicService {

    private final ScheduleService scheduleService;
    private final RedisService redisService;
    private final PrivateScheduleService privateScheduleService;

    private final ProductRepository productRepository;
    private final ProductFluctuationRepository productFluctuationRepository;
    private final EventRepository eventRepository;
    private final ServerSeasonInfoRepository serverSeasonInfoRepository;

    private final SimpMessageSendingOperations sendingOperations;
    private final ServerInfo serverInfo;
    private final Random random = new Random();

    @Value("${TURN_PERIOD_SEC}")
    private long turnPeriodSec;

    @Value("${EVENT_ARISE_TURN_COUNT}")
    private int eventTurnPeriod;
    @Value("${EVENT_ARISE_INITIAL_TURN}")
    private int eventInitialTurn;
    @Value("${NEWS_PUBLISH_INITIAL_TURN}")
    private int newsInitialTurn;
    @Value("${QUARTER_YEAR_TURN_PERIOD}")
    private int quarterYearTurnPeriod;
    @Value("${HALF_YEAR_BREAK_SEC}")
    private long halfYearBreakSec;
    @Value("${SEASON_YEAR_PERIOD}")
    private int seasonYearPeriod;
    private final String TURN = "fluctuate";
    private final String PUBLIC_EVENT = "event";
    private final String NEWSPAPER = "news";

    //DB에서 필요한 정보 로드
    private List<Event> occurableEventList; //발생가능한 이벤트 종류: 공통+현재계절
    private List<Integer> occurableProductIdList; //구매가능한 작물 종류: 공통+현재계절
    private Map<Integer, FluctationInfo> fluctationInfoMap; //작물별 가격변동폭

    //게임에서 필요한 정보
    private List<Event> currentEventList; //현재 적용 중 이벤트
    private List<Event> nextEventList;//다음에 발생할 이벤트

    private List<Integer> eventIndexList; //productInfoMap의 인덱스에 해당: 선정한 {NEWS_NUM}개 후보 이벤트

    //게임 내 필요 상수 정의
    private int NEWS_NUM = 4;
    private int BUYABLE_PRODUCT_NUM = 6;

    private final int PLAY_LONG_TIME = 2; //3시간

    private boolean loadServerInfo() {
//        if(redisService.hasKey(RedisPrefix.SERVER_INFO.prefix())){
//            ServerInfo loadedServerInfo=(ServerInfo) redisService.getValues(RedisPrefix.SERVER_INFO.prefix());
//            serverInfo.setProductInfoMap(loadedServerInfo.getProductInfoMap());
//            serverInfo.setSeasonId(loadedServerInfo.getSeasonId());
//            serverInfo.setCurrentTurn(loadedServerInfo.getCurrentTurn());
//            serverInfo.setBuyableProducts(loadedServerInfo.getBuyableProducts());
//            serverInfo.setTurnStartTime(loadedServerInfo.getTurnStartTime());
//            serverInfo.setSpecialEventIdList(loadedServerInfo.getSpecialEventIdList());
//            return true;
//        }
        redisService.deleteValues(RedisPrefix.SERVER_NEWS.prefix());
        redisService.deleteValues(RedisPrefix.SERVER_INFO.prefix());
//        redisService.deleteValues(RedisPrefix.SERVER_BREAK.prefix());
        ServerSeasonInfo seasonInfo = serverSeasonInfoRepository.findFirstByOrderBySeasonIdDesc();
        int gameSeason = 1;
        if (seasonInfo != null) {
            gameSeason = seasonInfo.getSeasonId() + 1;
        }
        serverInfo.setSeasonId(gameSeason);

        serverInfo.setCurrentTurn(0);
        serverInfo.setSpecialEventIdList(new ArrayList<>());
        serverInfo.setTurnStartTime(LocalDateTime.now());
        serverSeasonInfoRepository.save(ServerSeasonInfo.builder().seasonId(gameSeason).startedAt(serverInfo.getTurnStartTime()).build());
        return false;
    }

    public void initSeason() {
        boolean hasServerData = loadServerInfo();
        occurableEventList = new ArrayList<>(); //발생가능한 이벤트 종류: 공통+현재계절
        occurableProductIdList = new ArrayList<>(); //구매가능한 작물 종류: 공통+현재계절
        updateQuarterYearList(); //계절마다 발생가능한 이벤트, 작물 초기화 ->처음에 updateTurn으로 시작하면서 진행됨 
        //TODO - 최적화 확인
        //현재 적용 중 이벤트
        currentEventList = serverInfo.getSpecialEventIdList().stream().map(
                specialEventId ->
                        eventRepository.findById(specialEventId).orElseThrow(EventNotFoundException::new)

        ).toList();
        initProductInfo(hasServerData);
        eventIndexList = new ArrayList<>(NEWS_NUM); //productInfoMap의 인덱스에 해당: 선정한 {NEWS_NUM}개 후보 이벤트

    }


    //TODO 상수 C 정의 필요
    int C = 1_000_000; //평균 처음 기본금액은 5_000(G) => 평균 200개

    private void initProductInfo(boolean hasServerData) {
        fluctationInfoMap = new HashMap<>();
        Map<Integer, ServerProductInfo> productInfoMap = new HashMap<>();

        productRepository.findAll().stream().forEach((product) -> {
            ProductFluctuation fluctuation = productFluctuationRepository.findById(ProductFluctuationId.builder()
                            .countPerTenDays(0).productId(product.getProductId())
                            .build())
                    .orElseThrow(ProductFluctuationNotFoundException::new);

            double maxFluctuationRate = fluctuation.getMaxFluctuationRate();
            double minFluctuationRate = fluctuation.getMinFluctuationRate();
            if (maxFluctuationRate == 0) {
                //fluctuation 정보 없는 것들은 전체의 평균 fluctuation 이용
                List<ProductFluctuation> productFluctuationList = productFluctuationRepository.findByProductId(product.getProductId());
                maxFluctuationRate = productFluctuationList.stream().filter(productFluctuation -> productFluctuation.getMaxFluctuationRate() > 0)
                        .mapToDouble(ProductFluctuation::getMaxFluctuationRate).average().getAsDouble();
                minFluctuationRate = productFluctuationList.stream().filter(productFluctuation -> productFluctuation.getMinFluctuationRate() > 0)
                        .mapToDouble(ProductFluctuation::getMinFluctuationRate).average().getAsDouble();
            }
            fluctationInfoMap.put(product.getProductId(), FluctationInfo.builder()
                    .productAvgCost(product.getProductAvgCost())
                    .minFluctuationRate(minFluctuationRate)
                    .maxFluctuationRate(maxFluctuationRate)
                    .EventEffect(0.0)
                    .build());

            if (!hasServerData) {
                int cost = product.getProductDefaultCost();
                if (cost == 0) {
                    //default 가격 정보 없는 경우 평균 가격 사용
                    cost = product.getProductAvgCost().intValue();
                }
                productInfoMap.put(product.getProductId(), ServerProductInfo.builder()
                        .productCost(cost)
                        .productFluctuation(0)
                        .productMaxQuantity((int) (C / product.getProductAvgCost()))
                        .build());
            }

        });
        currentEventList.stream().forEach(
                event -> {
                    fluctationInfoMap.get(event.getProductId()).setEventEffect(event.getEventVariance());
                }
        );
        if (!hasServerData) serverInfo.setProductInfoMap(productInfoMap);
    }

    //반기 스케쥴 등록/삭제
    public void startHalfYearGame() {
        long eventPeriodSec = eventTurnPeriod * turnPeriodSec;
        endBreak();
        scheduleService.register(PUBLIC_EVENT, eventInitialTurn * turnPeriodSec, eventPeriodSec, () -> {
            createEvent();
        });
        scheduleService.register(TURN, turnPeriodSec, () -> {
            executePerTurn();
        });
        scheduleService.register(NEWSPAPER, newsInitialTurn * turnPeriodSec, eventPeriodSec, () -> {
            createNewspaper();
        });
    }

    public void endHalfYearGame() {
        startHalfBreakTime();
        scheduleService.remove(TURN);
        scheduleService.remove(PUBLIC_EVENT);
        scheduleService.remove(NEWSPAPER);
    }

    @Override
    public void endSeason() {
        startSeasonBreakTime();
        //TODO- 시즌 종료했을 때 필요한 정보들 어디로 다 보내기....
        redisService.deleteValues(RedisPrefix.SERVER_NEWS.prefix());
        redisService.deleteValues(RedisPrefix.SERVER_INFO.prefix());
//        log.debug("delete news...."+redisService.hasKey(RedisPrefix.SERVER_NEWS.prefix()));
//        log.debug("delete info...."+redisService.hasKey(RedisPrefix.SERVER_INFO.prefix()));

    }

    //실행======================

    //1턴마다 실행: 가격 변동, 구매 가능 리스트 변동
    private void executePerTurn() {
        updateBuyableProduct();
        fluctuateProduct();
        updateTurn();
        log.debug(serverInfo.getCurrentTurn() + "번째 턴 실행 :" + serverInfo.getTurnStartTime());
        sendPublicMessage(MessageType.GET_PUBLIC_EVENT,
                PublicEventInfo.builder()
                        .inGameTime(LocalDateTime.now())
                        .turn(serverInfo.getCurrentTurn())
                        .turnStartTime(serverInfo.getTurnStartTime())
                        .specialEventId(serverInfo.getSpecialEventIdList())
                        .productInfoList(serverInfo.getProductInfoMap().entrySet().stream().map(entry ->
                                ProductInfo.builder()
                                        .productId(entry.getKey())
                                        .productCost(entry.getValue().getProductCost())
                                        .productMaxQuantity(entry.getValue().getProductMaxQuantity())
                                        .productFluctuation(entry.getValue().getProductFluctuation())
                                        .build()
                        ).toList())
                        .buyableProductList(serverInfo.getBuyableProducts())
                        .build());
        if (serverInfo.getCurrentTurn() % 10 == 9) {
            updateFluctuationInfoPer10Days();
        }
    }


    //계절마다 나타나는 작물, 이벤트 리스트 변경
    public void updateQuarterYearList() {
        ProductType currentSeason;
        switch ((serverInfo.getCurrentTurn() % (quarterYearTurnPeriod*4)) / quarterYearTurnPeriod) {
            case 0:
                currentSeason = ProductType.SPRING;
                break;
            case 1:
                currentSeason = ProductType.SUMMER;
                break;
            case 2:
                currentSeason = ProductType.FALL;
                break;
            case 3:
                currentSeason = ProductType.WINTER;
                break;
            default:
                throw new CurrentTurnNotInNormalRangeException();
        }
        occurableEventList = eventRepository.findEventsOccurInSpecificSeason(currentSeason.name());
        occurableProductIdList = productRepository.findAllByProductTypeOrProductType(currentSeason, ProductType.ALL).stream().map((product -> product.getProductId())).toList();
        log.debug("Change to " + currentSeason + " event: " + occurableEventList.size() + ", product: " + occurableProductIdList.size());
    }

    //뉴스 발행
    public void createNewspaper() {
        List<Article> articles = new ArrayList<>();
        Set<Integer> occurableProductSet = new HashSet<>(occurableProductIdList);
        Set<Integer> newsIndex = new HashSet<>(NEWS_NUM);
        int possibleEventNum = occurableEventList.size();
        while (newsIndex.size() < NEWS_NUM) {
            int i = random.nextInt(possibleEventNum);
            if (!newsIndex.contains(i)) {
                //현재 계절에 나올 수 있는 작물에 대한 이벤트인지 확인
                if (occurableProductSet.contains(occurableEventList.get(i).getProductId())) {
                    newsIndex.add(i);
                    articles.add(Article.builder()
                            .articleHeadline(occurableEventList.get(i).getEventHeadline())
                            .build());
                }
            }
        }
        eventIndexList = newsIndex.stream().toList();
        NewsInfo news = NewsInfo.builder()
                .articleList(articles)
                .publishTurn(serverInfo.getCurrentTurn())
                .build();
        // /public으로 뉴스 보내기
        sendPublicMessage(MessageType.GET_NEWSPAPER, news);
        // 뉴스 저장해두기
        redisService.setValues(RedisPrefix.SERVER_NEWS.prefix(), news);
//        log.info(serverInfo.getSeasonId() + " || eventSize: " + possibleEventNum);
//        log.info(news.toString());
//        System.out.println((ServerInfo)redisService.getValues("SERVER_INFO"));
    }

    //이벤트 발생
    public void createEvent() {
        //4개의 이벤트 후보 중 하나 선정
        nextEventList = eventIndexList.stream().filter(
                eventIndex -> random.nextDouble() > 0.5
        ).map(eventIndex ->
                occurableEventList.get(eventIndex)
        ).toList();
        if (nextEventList == null || nextEventList.isEmpty()) return;
        nextEventList.stream().forEach(
                event -> {
                    fluctationInfoMap.get(event.getProductId())
                            .setEventEffect(fluctationInfoMap.get(event.getProductId()).getEventEffect() + event.getEventVariance());
                }
        );
//        log.debug("이벤트 결정 완료: " + nextEventList);
    }

    public void updateTurn() {
        if (serverInfo.getCurrentTurn() % quarterYearTurnPeriod == 0) { //계절 변경. 0이라는 의미는..  이제
            updateQuarterYearList();
        }
        serverInfo.setCurrentTurn(serverInfo.getCurrentTurn() + 1);
        serverInfo.setTurnStartTime(LocalDateTime.now());
        if (serverInfo.getCurrentTurn() % eventTurnPeriod == 0) {
            //TODO- nextEvent가 null인 경우 처리
            serverInfo.setSpecialEventIdList(nextEventList.stream().map(event -> {
                //TODO - 로그메세지 말고 redis에 저장하는 식으로 변경하기
                SpecialEventLogInfo logInfo = SpecialEventLogInfo.builder()
                        .eventId(event.getEventId())
                        .seasonId(serverInfo.getSeasonId())
                        .build();
                LogMessage logMessage = LogMessage.builder()
                        .type("SPECIAL_EVENT")
                        .body(logInfo)
                        .build();
                ObjectMapper objectMapper = new ObjectMapper();
                try {
                    String logData = objectMapper.writeValueAsString(logMessage);
                    log.debug(logData);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
                return event.getEventId();
            }).toList());
            currentEventList = nextEventList;
            nextEventList = null;
//            log.debug("==================event 변경==================");
        }
        privateScheduleService.initGameInfoForAllUsersPerTurn();
        redisService.setValues(RedisPrefix.SERVER_INFO.prefix(), serverInfo);
    }

    double CORRECTION_VALUE = 0.2;
    double MAX_AVG_MULTIPLE_LIMIT = 20;
    double MIN_AVG_MULTIPLE_LIMIT = 0.2;

    //가격 변동
    public void fluctuateProduct() {
        //FluctMap에 따라 각 작물 가격 변동
        Map<Integer, ServerProductInfo> tempFluctMap = new HashMap<>();
        for (Map.Entry<Integer, ServerProductInfo> entry : serverInfo.getProductInfoMap().entrySet()) {
            Integer productId = entry.getKey();
            ServerProductInfo productInfo = entry.getValue();
            FluctationInfo fluctationInfo = fluctationInfoMap.get(productId);
            //random값 생성
            double randomRate;
            double eventEffectRate = 1 + fluctationInfo.getEventEffect() / 100;
            if (productInfo.getProductCost() >= fluctationInfo.getProductAvgCost() * eventEffectRate * MAX_AVG_MULTIPLE_LIMIT) {
                //평균값의 N배 이상인 경우, min, maxRate 값 변동! -> 변동폭 만큼 각 rate에서 준다
                double maxRate = fluctationInfo.getMinFluctuationRate();
                double minRate = (fluctationInfo.getMinFluctuationRate() * 2 - fluctationInfo.getMaxFluctuationRate()) * (1 - CORRECTION_VALUE);
                randomRate = random.nextDouble(minRate, maxRate);
//                log.debug(productId + "@@@@@너무 비싸요@@@@@" + minRate + ">" + randomRate + "<" + maxRate);
                //TODO- 그럼에도 계속 올라가는 경우 조정해줘야 할지 논의 필요-> 해줘야 한다...
            } else if (fluctationInfo.getMinFluctuationRate() > 1) {
                //증가만 하는 경우
                randomRate = random.nextDouble(fluctationInfo.getMinFluctuationRate() * eventEffectRate * (1 - CORRECTION_VALUE), (fluctationInfo.getMaxFluctuationRate() + 0.001) * eventEffectRate);
            } else {
                //평균적인 경우
                randomRate = random.nextDouble(fluctationInfo.getMinFluctuationRate() * eventEffectRate * (1 - CORRECTION_VALUE), (fluctationInfo.getMaxFluctuationRate() + 0.001) * eventEffectRate * (1 + CORRECTION_VALUE));
            }
            int newCost = (int) (productInfo.getProductCost() * randomRate);
            if (productInfo.getProductCost() <= fluctationInfo.getProductAvgCost() * MIN_AVG_MULTIPLE_LIMIT) {
                //가격이 너무 작은 경우, 평균 가격의 일부 얻으므로써 보정
                newCost += (int) (fluctationInfo.getProductAvgCost() * randomRate * MIN_AVG_MULTIPLE_LIMIT);
            }
            //임시 배열에 저장, 한 번에 값들 업데이트 하기 위함!
            tempFluctMap.put(productId, ServerProductInfo.builder()
                    .productCost(newCost)
                    .productFluctuation(newCost - productInfo.getProductCost())
                    .productMaxQuantity(productInfo.getProductMaxQuantity())
                    .build());
        }
        serverInfo.setProductInfoMap(tempFluctMap);
    }

    //구매가능 작물 리스트 변동
    public void updateBuyableProduct() {
        Set<Integer> buyableProductIndex = new HashSet<>(BUYABLE_PRODUCT_NUM);
        int possibleProductNum = occurableProductIdList.size();
        while (buyableProductIndex.size() < BUYABLE_PRODUCT_NUM) {
            int i = random.nextInt(possibleProductNum);
            if (!buyableProductIndex.contains(i)) {
                buyableProductIndex.add(i);
            }
        }
        serverInfo.setBuyableProducts(buyableProductIndex.stream().map(i -> occurableProductIdList.get(i)).toList());
    }

    //가격 범위 변동 -> fluctMap 업데이트: 10일마다 실행
    public void updateFluctuationInfoPer10Days() {
        int countPerTenDays = (serverInfo.getCurrentTurn() % (quarterYearTurnPeriod * 4)) / 10;
        fluctationInfoMap.entrySet().stream().forEach(
                (entry) -> {
                    ProductFluctuation fluctuation = productFluctuationRepository.findById(ProductFluctuationId.builder()
                            .productId(entry.getKey()).countPerTenDays(countPerTenDays).build()
                    ).orElseThrow(ProductFluctuationNotFoundException::new);

                    if (fluctuation.getMaxFluctuationRate() != 0) { //변동 폭이 0일 때는 pass
                        entry.getValue().setMinFluctuationRate(fluctuation.getMinFluctuationRate());
                        entry.getValue().setMaxFluctuationRate(fluctuation.getMaxFluctuationRate());
                    }
                }
        );
    }

    //    @Scheduled(cron = "0 0  * * * *")
    @Scheduled(cron = "0 * * * * *")
    public void checkLongPlayTime() {
        LocalDateTime currentTime = LocalDateTime.now();
        privateScheduleService.getUserAlertPlayTimeMap().entrySet().stream().forEach(
                entry -> {
                    if (Duration.between(entry.getValue().getChecked(), currentTime).toMinutes() >= PLAY_LONG_TIME) {
//                    if (Duration.between(entry.getValue().getChecked(),currentTime).toHours() >= PLAY_LONG_TIME) {

                        String userId = entry.getKey();
                        sendPrivateMessage(userId, MessageType.ALERT_PLAYTIME, PlayTimeInfo.builder()
                                .playTime(PLAY_LONG_TIME * entry.getValue().getAlertCount())
                                .build());
                        privateScheduleService.updateUserAlertPlayTimeMap(userId);

                    }
                }
        );
    }

    public void sendPrivateMessage(String userId, MessageType type, Object body) {
        log.debug("<PRIVATE> Message.." + userId + " " + type);
        if (!redisService.hasKey(RedisPrefix.WEBSOCKET.prefix() + userId))
            throw new AccessToInvalidWebSocketIdException();
        String webSocketId = (String) redisService.getValues(RedisPrefix.WEBSOCKET.prefix() + userId);
        sendingOperations.convertAndSend("topic/private/" + webSocketId, GameMessageRes.builder()
                .type(type)
                .isSuccess(true)
                .body(body)
                .build());
    }

    private void startHalfBreakTime() {
        //마지막 턴이 아닌 경우만 반기 결산
        if (serverInfo.getCurrentTurn() >= quarterYearTurnPeriod * 4 * seasonYearPeriod) return;
        startBreakTime("반기", halfYearBreakSec);
    }

    //이거는.. 시즌종료 호출될 때 호출!!
    private void startSeasonBreakTime() {
        LocalDateTime seasonStartDateTime = serverSeasonInfoRepository.findFirstByOrderBySeasonIdDesc().getStartedAt();
        long seasonBreakTimeSec = Duration.between(LocalDateTime.now(), seasonStartDateTime.plusDays(7)).toSeconds();
        startBreakTime("시즌", seasonBreakTimeSec);
    }

    private void startBreakTime(String breakName, Long breakTimeSec) {
        if (redisService.hasKey(RedisPrefix.SERVER_BREAK.prefix())) {
            log.warn("Server is breaking now...");
            return;
        }
        BreakTimeInfo breakTimeInfo = BreakTimeInfo.builder()
                .isBreakTime(true)
                .breakName(breakName)
                .breakTime(LocalDateTime.now().plusSeconds(breakTimeSec))
                .ingameTime(LocalDateTime.now())
                .build();
        sendPublicMessage(MessageType.GET_BREAK_TIME, breakTimeInfo);
        redisService.setValues(RedisPrefix.SERVER_BREAK.prefix(), breakTimeInfo);
        log.debug(breakName + " 휴식시간입니다..." + breakTimeInfo.toString());
    }

    private void endBreak() {
        if (!redisService.hasKey(RedisPrefix.SERVER_BREAK.prefix())) {
            sendPublicMessage(MessageType.GET_BREAK_TIME, BreakTimeInfo.builder()
                    .breakName("시즌")
                    .isBreakTime(false)
                    .breakTime(LocalDateTime.now())
                    .ingameTime(LocalDateTime.now())
                    .build());
            return;
        }
        BreakTimeInfo breakTimeInfo = (BreakTimeInfo) redisService.getValues(RedisPrefix.SERVER_BREAK.prefix());
        breakTimeInfo.setIsBreakTime(false);
        LocalDateTime testNow = LocalDateTime.now();
//        log.debug("휴식시간은.."+breakTimeInfo.getBreakTime());
//        log.debug("휴식시간 체크1.."+breakTimeInfo.getBreakTime().isBefore(testNow));
//        log.debug("휴식시간 체크2.."+breakTimeInfo.getBreakTime().isAfter(testNow));
//        if ("반기".equals(breakTimeInfo.getBreakName()) && breakTimeInfo.getBreakTime().isBefore(LocalDateTime.now())) {
//            log.warn("아직 휴식시간이에용...." + breakTimeInfo.getBreakName()+" : "+breakTimeInfo.getBreakTime());
//            return;
//        }
        breakTimeInfo.setIngameTime(LocalDateTime.now());
        sendPublicMessage(MessageType.GET_BREAK_TIME, breakTimeInfo);
        redisService.deleteValues(RedisPrefix.SERVER_BREAK.prefix());
        log.debug("휴식시간이 종료되었습니다.");
    }

    // /public에 메세지 발행
    public void sendPublicMessage(MessageType type, Object body) {
        log.debug(body.toString());
        GameMessageRes messageRes = GameMessageRes.builder()
                .type(type)
                .isSuccess(true)
                .body(body)
                .build();
        sendingOperations.convertAndSend("/topic/public", messageRes);
        log.debug("<PUBLIC> message: " + type);
    }


    public NewsInfo searchNewspaper() {
        if (!redisService.hasKey(RedisPrefix.SERVER_NEWS.prefix())) {
            List<Article> articles = new ArrayList<>();
            articles.add(Article.builder().articleHeadline("[단독] 신문을 통해 곧 발생할 이벤트에 대한 정보를 얻을 수 있다 전해..").build());
            articles.add(Article.builder().articleHeadline("합숙하며 플젝하는 팀이 있다? '충격 실화' 또는 '만우절 거짓말' 대중 의견 분분..").build());
            articles.add(Article.builder().articleHeadline("오늘의 노래 추천: 첫만남은 계획대로 되지 않아").build());
            articles.add(Article.builder().articleHeadline("떡상 화이화이팅ㅠ").build());
            return NewsInfo.builder()
                    .publishTurn(0)
                    .articleList(articles)
                    .build();
        }
        return (NewsInfo) redisService.getValues(RedisPrefix.SERVER_NEWS.prefix());
    }

    @Override
    public BreakTimeInfo searchBreakTime() {
        if (!redisService.hasKey(RedisPrefix.SERVER_BREAK.prefix())) {
            return BreakTimeInfo.builder()
                    .isBreakTime(false)
                    .breakName("반기")
                    .breakTime(LocalDateTime.now())
                    .ingameTime(LocalDateTime.now())
                    .build();
        }
        BreakTimeInfo breakTimeInfo = (BreakTimeInfo) redisService.getValues(RedisPrefix.SERVER_BREAK.prefix());
        breakTimeInfo.setIngameTime(LocalDateTime.now());
        return breakTimeInfo;
    }
}
