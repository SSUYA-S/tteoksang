package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.*;
import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.game.exception.ProductFluctuationNotFoundException;
import com.welcome.tteoksang.game.repository.ProductFluctuationRepository;
import com.welcome.tteoksang.game.scheduler.ScheduleService;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.repository.ProductRepository;
import com.welcome.tteoksang.resource.type.MessageType;
import jakarta.validation.constraints.NotNull;
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
    private final SimpMessageSendingOperations sendingOperations;

    private String publicEventId;
    private List<String> nextEvent;

    private List<Article> newspaper = new ArrayList<>();
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
    Map<Integer, FluctationInfo> fluctationInfoMap;
    List<ProductInfo> productInfoList;


    public void initSeason() {
        initProductInfo();
        ServerInfo.currentTurn = 0;
        ServerInfo.turnStartTime = LocalDateTime.now();
        ServerInfo.specialEventId = "121212";
    }

    //TODO 상수 C 정의 필요
    int C = 1000;

    private void initProductInfo() {
        fluctationInfoMap = new HashMap<>();
        productInfoList = productRepository.findAll().stream().map(
                (product) -> {
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

                    return ProductInfo.builder()
                            .productId(product.getProductId())
                            .productCost(product.getProductDefaultCost())
                            .productFluctuation(0)
                            .productMaxQuantity((int) (C / product.getProductAvgCost()))
                            .build();
                }
        ).toList();
    }

    //반기 스케쥴 등록/삭제
    public void startHalfYearGame() {
        scheduleService.register(PUBLIC_EVENT, eventTime, eventPeriod, () -> {
            log.debug("EVENT!!");
        });
        scheduleService.register(FLUCTUATE, turnPeriod, () -> {
            log.debug("fluctuate...");
            fluctuateProduct();
            sendPublicMessage(MessageType.GET_PUBLIC_EVENT,
                    PublicEventInfo.builder()
                            .ingameTime(LocalDateTime.now())
                            .turn(ServerInfo.currentTurn)
                            .turnStartTime(ServerInfo.turnStartTime)
                            .specialEventId(ServerInfo.specialEventId)
                            .productInfoList(productInfoList)
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

    //계절마다 이벤트 변경
    public void updateEventList() {
//        switch ((ServerInfo.currentTurn%360)/90){
//            case 0:
//                return SPRING;
//            case 1:
//                return SUMMER;
//            case 2:
//                return FALL;
//            case 3:
//                return WINTER;
//            default:
//                return null;
//        }

    }

    //뉴스 발행
    public void createNewspaper() {
        // `ALL`, `현재 계절` 인 이벤트 중 ...
        // 그 중 랜덤하게 4개 이벤트 후보 뽑아서 저장
        // Headline 담아서 List<Article> 제작
        List<Article> articles;
        // /public으로 아티클 리스트 보내기
        // 아티클 리스트 저장해두기
    }

    //이벤트 발생
    public void createEvent() {
        //4개의 이벤트 후보 중 하나 선정
        //영향 가는 농산물에 대해 FluctMap 변경시키기
    }

    //TODO- 상수 K 정의
    double K = 1.3;

    //가격 변동
    public void fluctuateProduct() {
        //FluctMap에 따라 각 작물 가격 변동
        Random random = new Random(); // -> 싱글톤으로 만들어놔도 될듯
        for (ProductInfo productInfo : productInfoList) {
            FluctationInfo fluctationInfo = fluctationInfoMap.get(productInfo.getProductId());
            //random값 생성
            double value = random.nextDouble(fluctationInfo.getMinFluctuationRate(), fluctationInfo.getMaxFluctuationRate() + 0.001);
            //fluctuation k배하여 반영
            int newCost = (int) (fluctationInfo.getProductAvgCost() * value * K);
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
    public void sendPublicMessage(MessageType type, @NotNull Object body) {
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
        return newspaper;
    }

    public PublicEventInfo searchPublicEvent() {

        return null;
    }
}
