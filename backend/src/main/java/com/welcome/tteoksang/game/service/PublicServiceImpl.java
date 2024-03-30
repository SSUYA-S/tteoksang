package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.*;
import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.game.exception.CurrentTurnNotInNormalRangeException;
import com.welcome.tteoksang.game.exception.EventNotFoundException;
import com.welcome.tteoksang.game.exception.ProductFluctuationNotFoundException;
import com.welcome.tteoksang.game.repository.ProductFluctuationRepository;
import com.welcome.tteoksang.game.repository.ServerSeasonInfoRepository;
import com.welcome.tteoksang.game.scheduler.ScheduleService;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.dto.Event;
import com.welcome.tteoksang.resource.repository.EventRepository;
import com.welcome.tteoksang.resource.repository.ProductRepository;
import com.welcome.tteoksang.resource.type.MessageType;
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
    private final Random random = new Random();

    @Value("${TURN_PERIOD}")
    private long turnPeriod;
    @Value("${EVENT_ARISE_PERIOD}")
    private long eventPeriod;
    @Value("${EVENT_ARISE_TIME}")
    private long eventTime;
    @Value("${NEWS_PUBLISH_TIME}")
    private long newsTime;
    private final String FLUCTUATE = "fluctuate";
    private final String PUBLIC_EVENT = "event";
    private final String NEWSPAPER = "news";

    //DB에서 필요한 정보 로드
    private List<Event> occurableEventList; //발생가능한 이벤트 종류: 공통+현재계절
    private Map<Integer, FluctationInfo> fluctationInfoMap; //작물별 가격변동폭

    //게임에서 필요한 정보
    private Map<Integer, ServerProductInfo> productInfoMap; //작물별 가격,수량,어제대비 변동폭
    private Event currentEvent; //현재 적용 중 이벤트
    private Event nextEvent;//다음에 발생할 이벤트

    private List<Integer> eventIndexList; //productInfoMap의 인덱스에 해당: 선정한 {NEWS_NUM}개 후보 이벤트

    //게임 내 필요 상수 정의
    private int NEWS_NUM = 4;
    private int BUYABLE_PRODUCT_NUM = 6;
//    private int COMMON_EVENT_NUM;

    public void initSeason() {
        initProductInfo();
        initEventInfo();
        eventIndexList = new ArrayList<>();
        ServerInfo.specialEventId = "6608025f25e73856eb3c9bf1"; //이벤트 발생 안 함
        currentEvent = eventRepository.findById(ServerInfo.specialEventId).orElseThrow(EventNotFoundException::new);
        ServerSeasonInfo seasonInfo = serverSeasonInfoRepository.findFirstByOrderBySeasonIdDesc();
        int gameSeason = 1;
        if (seasonInfo != null) {
            gameSeason = seasonInfo.getSeasonId() + 1;
        }
        ServerInfo.currentTurn = 0;
        ServerInfo.turnStartTime = LocalDateTime.now();
        serverSeasonInfoRepository.save(ServerSeasonInfo.builder().seasonId(gameSeason).startedAt(ServerInfo.turnStartTime).build());
    }

    private void initEventInfo() { //TODO- 계절마다 실행되어야 한다
        occurableEventList = new ArrayList<>();
        //계절 기준으로 이벤트 정보 리스트 찾기
        occurableEventList = eventRepository.findEventsOccurInSpecificSeason("SPRING");
        log.info(occurableEventList.toString());
    }

    //TODO 상수 C 정의 필요
    int C = 1000;

    private void initProductInfo() {
        fluctationInfoMap = new HashMap<>();
        productInfoMap = new HashMap<>();

        productRepository.findAll().stream().forEach((product) -> {
            ProductFluctuation fluctuation = productFluctuationRepository.findById(ProductFluctuationId.builder()
                            .countPerTenDays(0).productId(product.getProductId())
                            .build())
                    .orElseThrow(ProductFluctuationNotFoundException::new);
            fluctationInfoMap.put(product.getProductId(), FluctationInfo.builder()
                    .productAvgCost(product.getProductAvgCost())
                    .minFluctuationRate(fluctuation.getMinFluctuationRate())
                    .maxFluctuationRate(fluctuation.getMaxFluctuationRate())
                    .EventEffect(0.0)
                    .build());
            productInfoMap.put(product.getProductId(), ServerProductInfo.builder()
                    .productCost(product.getProductDefaultCost())
                    .productFluctuation(0)
                    .productMaxQuantity((int) (C / product.getProductAvgCost()))
                    .build());
        });
        redisService.setValues("SERVER_PRODUCT", productInfoMap);
    }

    //반기 스케쥴 등록/삭제
    public void startHalfYearGame() {
        scheduleService.register(PUBLIC_EVENT, eventTime, eventPeriod, () -> {
            log.debug("EVENT!!");
        });
        scheduleService.register(FLUCTUATE, turnPeriod, () -> {
            log.debug("fluctuate..." + ServerInfo.currentTurn);
            fluctuateProduct();
            updateTurn();
            sendPublicMessage(MessageType.GET_PUBLIC_EVENT,
                    PublicEventInfo.builder()
                            .inGameTime(LocalDateTime.now())
                            .turn(ServerInfo.currentTurn)
                            .turnStartTime(ServerInfo.turnStartTime)
                            .specialEventId(ServerInfo.specialEventId)
                            .productInfoList(productInfoMap.entrySet().stream().map((entry) -> {
                                return ProductInfo.builder()
                                        .productId(entry.getKey())
                                        .productCost(entry.getValue().getProductCost())
                                        .productMaxQuantity(entry.getValue().getProductMaxQuantity())
                                        .productFluctuation(entry.getValue().getProductFluctuation())
                                        .build();
                            }).toList())
                            .buyableProductList(new ArrayList<>())
                            .build());
        });
        scheduleService.register(NEWSPAPER, newsTime, eventPeriod, () -> {
            log.debug("news!!");
        });
    }

    public void endHalfYearGame() {
        scheduleService.remove(FLUCTUATE);
        scheduleService.remove(NEWSPAPER);
        scheduleService.remove(PUBLIC_EVENT);
    }

    //실행======================

    //TODO- 계절마다 이벤트 변경
    public void updateEventList() {
        switch ((ServerInfo.currentTurn % 360) / 90) {
            case 0:
                occurableEventList = eventRepository.findEventsOccurInSpecificSeason("SPRING");
                break;
            case 1:
                occurableEventList = eventRepository.findEventsOccurInSpecificSeason("SUMMER");
                break;
            case 2:
                occurableEventList = eventRepository.findEventsOccurInSpecificSeason("FALL");
                break;
            case 3:
                occurableEventList = eventRepository.findEventsOccurInSpecificSeason("WINTER");
                break;
            default:
                throw new CurrentTurnNotInNormalRangeException();
        }

    }

    //뉴스 발행
    public void createNewspaper() {
        // `ALL`, `현재 계절` 인 이벤트 중 ...
        // 그 중 랜덤하게 4개 이벤트 후보 뽑아서 저장
        int n = occurableEventList.size();
        List<Article> articles = new ArrayList<>();
        random.ints(NEWS_NUM, 0, n).forEach(
                (index) -> {
                    // Headline 담아서 List<Article> 제작
                    articles.add(Article.builder()
                            .articleHeadline(occurableEventList.get(index).getEventHeadline())
                            .build()
                    );
                    eventIndexList.add(index);
                }
        );

        // /public으로 아티클 리스트 보내기
        sendPublicMessage(MessageType.GET_NEWSPAPER, articles);
        // 아티클 리스트 저장해두기
        redisService.setValues("SERVER_NEWS", articles);
    }

    //이벤트 발생
    public void createEvent() {
        //4개의 이벤트 후보 중 하나 선정
        int idx = random.nextInt(NEWS_NUM);
        //영향 가는 농산물에 대해 FluctMap 변경시키기
        nextEvent = occurableEventList.get(idx);
//        nextEvent.getEventVariance().stream().forEach(
//                (productVariance)->{
//                    FluctationInfo fluctationInfo=fluctationInfoMap.get(productVariance.getProductId());
//                    //fluct 바꾸기 처리
//                    //
//                    fluctationInfoMap.put(productVariance.getProductId(),fluctationInfo);
//                }
//        );
    }

    public void updateTurn() {
        ServerInfo.currentTurn++;
        ServerInfo.turnStartTime = LocalDateTime.now();
        if (ServerInfo.currentTurn % eventPeriod == 0) { //FIXME - eventPeriod를 턴의 "개수"로 변경
            ServerInfo.specialEventId = nextEvent.getEventId();
            currentEvent = nextEvent;
            nextEvent = null;
            updateEventList();
        }
        //TODO- redis에 서버 정보 저장
//        redisService.setValues("SERVER_INFO",productInfoMap);
    }

    //TODO- 상수 K 정의
    double K = 1.3;

    //가격 변동
    public void fluctuateProduct() {
        //FluctMap에 따라 각 작물 가격 변동
        for (Map.Entry<Integer, ServerProductInfo> entry : productInfoMap.entrySet()) {
            Integer productId = entry.getKey();
            ServerProductInfo productInfo = entry.getValue();
            FluctationInfo fluctationInfo = fluctationInfoMap.get(productId);
            //random값 생성
            double value = random.nextDouble(fluctationInfo.getMinFluctuationRate(), fluctationInfo.getMaxFluctuationRate() + 0.001);
            //fluctuation k배하여 반영
            int newCost = (int) (fluctationInfo.getProductAvgCost() * value * K);
            if (productId == currentEvent.getProductId()) { //event 적용 변동폭
                newCost = (int) (newCost * (100 + currentEvent.getEventVariance()));
            }
            productInfo.setProductFluctuation(newCost - productInfo.getProductCost());
            productInfo.setProductCost(newCost);
        }
    }

    //가격 범위 변동 -> fluctMap 업데이트
    public void updateFluctuationInfo() {
        int countPerTenDays = ServerInfo.currentTurn / 10;
        fluctationInfoMap.entrySet().stream().forEach(
                (entry) -> {
                    ProductFluctuation fluctuation = productFluctuationRepository.findById(ProductFluctuationId.builder()
                            .productId(entry.getKey()).countPerTenDays(countPerTenDays).build()
                    ).orElseThrow(ProductFluctuationNotFoundException::new);

                    entry.getValue().setMinFluctuationRate(fluctuation.getMinFluctuationRate());
                    entry.getValue().setMaxFluctuationRate(fluctuation.getMaxFluctuationRate());
                }
        );
    }

    // /public에 메세지 발행
    public void sendPublicMessage(MessageType type, Object body) {
        // TODO- check: isSuccess가 false가 될 일이... 있나....? 서버만이 보내는데?
        GameMessageRes messageRes = GameMessageRes.builder()
                .type(type)
                .isSuccess(true)
                .body(body)
                .build();
        sendingOperations.convertAndSend("/topic/public", messageRes);
        log.debug("send message: " + type);
    }


    public List<Article> searchNewspaper() {
//        List<Article> articles = new ArrayList<>();
//        eventIndexList.stream().forEach(
//                (index) -> {
//                    // Headline 담아서 List<Article> 제작
//                    articles.add(Article.builder()
//                            .articleHeadline(arisableEventList.get(index).getEventHeadline())
//                            .build()
//                    );
//                }
//        );
        return (List<Article>) redisService.getValues("SERVER_NEWS");
    }

    public PublicEventInfo searchPublicEvent() {

        return null;
    }
}
