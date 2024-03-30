package com.welcome.tteoksang.game.scheduler;

import com.welcome.tteoksang.game.dto.GameMessage;
import com.welcome.tteoksang.game.service.PublicService;
import com.welcome.tteoksang.resource.type.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import static java.time.LocalTime.now;

@Controller
@RequiredArgsConstructor
@Slf4j
public class SceduledGameController {

    private final SimpMessageSendingOperations sendingOperations;
    private final PublicService publicService;
    private final ScheduleService scheduleService;

    @Value("${HALF_YEAR_PERIOD}")
    private long halfPeriod;
    @Value("${HALF_YEAR_REPORT_PERIOD}")
    private long halfReportPeriod;
    @Value("${SEASON_PERIOD}")
    private long seasonPeriod;
    @Value("${SEASON_START_DATE}")
    private String seasonStartCron;

    @GetMapping("/test/s/{scheduledId}")
    void startJob(@PathVariable String scheduledId) {
        String cronExpression = "0 0 10 ? * 1 *";
        long offset = (halfPeriod + halfReportPeriod) * 2 * seasonPeriod - halfReportPeriod;
        String nextCronExpression = scheduleService.createGeneralCronPerWeek(cronExpression, offset);
        // 결과 출력
        System.out.println("현재 시간 이후 " + offset + "초 이후의 cron 표현식: " + nextCronExpression);

    }


    @GetMapping("/test/season")
    @Scheduled(cron = "${SEASON_START_DATE}") //시즌 시작 시 마다 실행됨!
    public void startGame() {
        publicService.initSeason();
        log.debug("=========start SEASON==========");
        long period = halfPeriod + halfReportPeriod;
        long offset = (halfPeriod + halfReportPeriod) * 2 * seasonPeriod - halfReportPeriod;
        //반기 이벤트 등록 -> 주기는 9시간 9분
        scheduleService.register("half-register", period, () -> {
            publicService.startHalfYearGame();
        });
        //반기 이벤트 삭제 이벤트 등록-> 주기는 9시간 9분, 시작은 9시간 후부터
        scheduleService.register("half-remove", halfPeriod, period, () -> {
            publicService.endHalfYearGame();
        });
        //전체 이벤트 삭제 이벤트 등록-> 주에 한 번(시즌 종료 시)만 실행되면 됨
        scheduleService.register("finishSeason", seasonStartCron, offset,
                () -> {
                    scheduleService.removeAllSchedule();
                });
    }

    // 서비스 테스트 용..

    @GetMapping("/test/news")
    public void sendNewspaper() {
        publicService.createNewspaper();
    }

    //    공통 이벤트 조회
// 초, 분, 시, 일, 월, 요일
//    @Scheduled(cron = "0/3 * * * * *")
    public void updatePublicEvent() {
        GameMessage message = new GameMessage();
//        publicService.applyEvent();
//        publicService.searchPublicEvent();
        message.setType(MessageType.GET_PUBLIC_EVENT);
//        log.debug(message.toString());
//        log.debug(Instant.now()+" == "+Instant.ofEpochMilli(System.currentTimeMillis())+" == "+System.currentTimeMillis());
        sendingOperations.convertAndSend("/public", message);
    }

}
