package com.welcome.tteoksang.game.scheduler;

import com.welcome.tteoksang.game.service.PublicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import static java.time.LocalTime.now;

@Controller
@RequiredArgsConstructor
@Slf4j
public class SceduledGameController {

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

    private boolean isSeasonStarted = false;

    @GetMapping("/test/season")
    @Scheduled(cron = "${SEASON_START_DATE}") //시즌 시작 시 마다 실행됨!
    public void startGame() {
        if (isSeasonStarted) {
            log.info("====already season is started====");
            return;
        }
        isSeasonStarted = true;
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

    @GetMapping("/test/season-end")
    public void endGame() {
        log.debug("=========end SEASON==========");
        scheduleService.removeAllSchedule();
        isSeasonStarted = false;
    }


}
