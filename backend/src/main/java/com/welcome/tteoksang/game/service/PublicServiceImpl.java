package com.welcome.tteoksang.game.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.game.dto.*;
import com.welcome.tteoksang.game.dto.event.Article;
import com.welcome.tteoksang.game.dto.log.LogMessage;
import com.welcome.tteoksang.game.dto.log.SpecialEventLogInfo;
import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.game.dto.event.NewsInfo;
import com.welcome.tteoksang.game.dto.event.PublicEventInfo;
import com.welcome.tteoksang.game.dto.server.FluctationInfo;
import com.welcome.tteoksang.game.dto.server.ServerProductInfo;
import com.welcome.tteoksang.game.dto.server.ServerSeasonInfo;
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
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@Validated
@RequiredArgsConstructor
public class PublicServiceImpl implements PublicService {

    private final ScheduleService scheduleService;
    private final RedisService redisService;

    private final ProductRepository productRepository;
    private final ProductFluctuationRepository productFluctuationRepository;
    private final EventRepository eventRepository;
    private final ServerSeasonInfoRepository serverSeasonInfoRepository;

    private final SimpMessageSendingOperations sendingOperations;
    private final ServerInfo serverInfo;
    private final Random random = new Random();

    @Value("${TURN_PERIOD}")
    private long turnPeriod;
    @Value("${EVENT_ARISE_PERIOD}")
    private long eventPeriod;
    @Value("${EVENT_ARISE_TIME}")
    private long eventTime;
    @Value("${NEWS_PUBLISH_TIME}")
    private long newsTime;
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
    private int NEWS_NUM = 2;
    private int BUYABLE_PRODUCT_NUM = 6;

    private boolean loadServerInfo() {
//        if(redisService.hasKey(RedisPrefix.SERVER_INFO.prefix())){
//            serverInfo=(ServerInfo) redisService.getValues(RedisPrefix.SERVER_INFO.prefix());
//            return true;
//        }
        ServerSeasonInfo seasonInfo = serverSeasonInfoRepository.findFirstByOrderBySeasonIdDesc();
        int gameSeason = 1;
        if (seasonInfo != null) {
            gameSeason = seasonInfo.getSeasonId() + 1;
        }
        serverInfo.setSeasonId(gameSeason);

        serverInfo.setCurrentTurn(0);
        serverInfo.setSpecialEventIdList(new ArrayList<>());
//        ServerInfo.specialEventId = "660924dcd3afc90f29fab272"; //이벤트 발생 안 함
        serverInfo.setTurnStartTime(LocalDateTime.now());
        serverSeasonInfoRepository.save(ServerSeasonInfo.builder().seasonId(gameSeason).startedAt(serverInfo.getTurnStartTime()).build());
        return false;
    }

    public void initSeason() {
        boolean hasServerData = loadServerInfo();
        occurableEventList = new ArrayList<>(); //발생가능한 이벤트 종류: 공통+현재계절
        occurableProductIdList = new ArrayList<>(); //구매가능한 작물 종류: 공통+현재계절
        updateQuarterYearList(); //계절마다 발생가능한 이벤트, 작물 초기화
        //현재 적용 중 이벤트
        currentEventList = serverInfo.getSpecialEventIdList().stream().map(
                specialEventId ->
                        eventRepository.findById(specialEventId).orElseThrow(EventNotFoundException::new)

        ).toList();
        initProductInfo(hasServerData);
        eventIndexList = new ArrayList<>(NEWS_NUM); //productInfoMap의 인덱스에 해당: 선정한 {NEWS_NUM}개 후보 이벤트

    }


    //TODO 상수 C 정의 필요
    int C = 1000000;

    private void initProductInfo(boolean hasServerData) {
        fluctationInfoMap = new HashMap<>();
        Map<Integer, ServerProductInfo> productInfoMap = new HashMap<>();

        productRepository.findAll().stream().forEach((product) -> {
            ProductFluctuation fluctuation = productFluctuationRepository.findById(ProductFluctuationId.builder()
                            .countPerTenDays(0).productId(product.getProductId())
                            .build())
                    .orElseThrow(ProductFluctuationNotFoundException::new);

            double eventEffect = 0.0;
            //TODO- event 적용시키기
//            if (currentEventList.getProductId() == product.getProductId())
//                eventEffect = currentEventList.getEventVariance();
            fluctationInfoMap.put(product.getProductId(), FluctationInfo.builder()
                    .productAvgCost(product.getProductAvgCost())
                    .minFluctuationRate(fluctuation.getMinFluctuationRate())
                    .maxFluctuationRate(fluctuation.getMaxFluctuationRate())
                    .EventEffect(eventEffect)
                    .build());

            if (!hasServerData) {
                productInfoMap.put(product.getProductId(), ServerProductInfo.builder()
                        .productCost(product.getProductDefaultCost())
                        .productFluctuation(0)
                        .productMaxQuantity((int) (C / product.getProductAvgCost()))
                        .build());
            }

        });

        if (!hasServerData) serverInfo.setProductInfoMap(productInfoMap);
    }

    private void initFluctMap() {
        fluctationInfoMap = new HashMap<>();

        productRepository.findAll().stream().forEach((product) -> {
            ProductFluctuation fluctuation = productFluctuationRepository.findById(ProductFluctuationId.builder()
                            .countPerTenDays(serverInfo.getCurrentTurn()).productId(product.getProductId())
                            .build())
                    .orElseThrow(ProductFluctuationNotFoundException::new);

            double eventEffect = 0.0;
            //TODO- event 적용시키기
//            if (currentEventList.getProductId() == product.getProductId())
//                eventEffect = currentEventList.getEventVariance();
            fluctationInfoMap.put(product.getProductId(), FluctationInfo.builder()
                    .productAvgCost(product.getProductAvgCost())
                    .minFluctuationRate(fluctuation.getMinFluctuationRate())
                    .maxFluctuationRate(fluctuation.getMaxFluctuationRate())
                    .EventEffect(eventEffect)
                    .build());
        });
    }

    //반기 스케쥴 등록/삭제
    public void startHalfYearGame() {
        scheduleService.register(PUBLIC_EVENT, eventTime, eventPeriod, () -> {
            log.debug("EVENT!!");
            createEvent();
        });
        scheduleService.register(TURN, turnPeriod, () -> {
            log.debug("fluctuate..." + serverInfo.getCurrentTurn());
            executePerTurn();
        });
        scheduleService.register(NEWSPAPER, newsTime, eventPeriod, () -> {
            log.debug("news!!");
            createNewspaper();
        });
    }

    public void endHalfYearGame() {
        scheduleService.remove(TURN);
        scheduleService.remove(NEWSPAPER);
        scheduleService.remove(PUBLIC_EVENT);
    }

    //실행======================

    //1턴마다 실행: 가격 변동, 구매 가능 리스트 변동
    private void executePerTurn() {
        fluctuateProduct();
        updateBuyableProduct();
        updateTurn();
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
        switch ((serverInfo.getCurrentTurn() % 360) / 90) {
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
    }

    //뉴스 발행
    public void createNewspaper() {
        int n = occurableEventList.size();
        List<Article> articles = new ArrayList<>();
        //TODO- 현재 이벤트 중복 허용 노노

        Set<Integer> newsIndex = new HashSet<>(NEWS_NUM);
        int possibleEventNum = occurableEventList.size();
        while (newsIndex.size() < NEWS_NUM) {
            int i = random.nextInt(possibleEventNum);
            if (!newsIndex.contains(i)) {
                newsIndex.add(i);
                articles.add(Article.builder()
                        .articleHeadline(occurableEventList.get(i).getEventHeadline())
                        .build());
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
        log.info(serverInfo.getSeasonId() + " || eventSize: " + occurableEventList.size());
        log.info(news.toString());
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
//        int eventIndex = eventIndexList.get(random.nextInt(NEWS_NUM));
//        //영향 가는 농산물에 대해 FluctMap 변경시키기
//        nextEvent = occurableEventList.get(eventIndex);
        //TODO- 여기서 rate 조정할지 확인 필요.. 현재 조정 중..
        nextEventList.stream().forEach(
                event -> {
                    fluctationInfoMap.get(event.getProductId()).setEventEffect(event.getEventVariance());
                }
        );
    }

    public void updateTurn() {
        serverInfo.setCurrentTurn(serverInfo.getCurrentTurn() + 1);
        serverInfo.setTurnStartTime(LocalDateTime.now());
        if (serverInfo.getCurrentTurn() % eventPeriod == 0) { //FIXME - eventPeriod를 턴의 "개수"로 변경
            serverInfo.setSpecialEventIdList(nextEventList.stream().map(event -> {
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
            updateQuarterYearList();
            log.debug("==================event 변경==================");
        }
        redisService.setValues(RedisPrefix.SERVER_INFO.prefix(), serverInfo);
    }

    //TODO- 상수 K 정의
    double K = 2.3;

    //가격 변동
    public void fluctuateProduct() {
        //FluctMap에 따라 각 작물 가격 변동
        for (Map.Entry<Integer, ServerProductInfo> entry : serverInfo.getProductInfoMap().entrySet()) {
            Integer productId = entry.getKey();
            ServerProductInfo productInfo = entry.getValue();
            FluctationInfo fluctationInfo = fluctationInfoMap.get(productId);
            //random값 생성
            double value = random.nextDouble(fluctationInfo.getMinFluctuationRate(), fluctationInfo.getMaxFluctuationRate() + 0.001);
            //fluctuation k배하여 반영 + 이벤트 변동폭 반영
            int newCost = (int) (fluctationInfo.getProductAvgCost() * value * K * (1 + fluctationInfo.getEventEffect() / 100));
//            if (productId == currentEvent.getProductId()) { //event 적용 변동폭
//                newCost = (int) (newCost * (100 + currentEvent.getEventVariance()));
//            }
            productInfo.setProductFluctuation(newCost - productInfo.getProductCost());
            productInfo.setProductCost(newCost);
        }
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
        int countPerTenDays = serverInfo.getCurrentTurn() / 10;
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

    // /public에 메세지 발행
    public void sendPublicMessage(MessageType type, Object body) {
        // TODO- check: isSuccess가 false가 될 일이... 있나....? 서버만이 보내는데?
        log.debug(body.toString());
        GameMessageRes messageRes = GameMessageRes.builder()
                .type(type)
                .isSuccess(true)
                .body(body)
                .build();
        sendingOperations.convertAndSend("/topic/public", messageRes);
        log.debug("send message: " + type);
    }


    public NewsInfo searchNewspaper() {
        return (NewsInfo) redisService.getValues(RedisPrefix.SERVER_NEWS.prefix());
    }

    public PublicEventInfo searchPublicEvent() {
        return null;
    }
}
