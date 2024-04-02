package com.welcome.tteoksang.game.scheduler;

import com.welcome.tteoksang.game.service.PublicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;

import static java.time.LocalTime.now;

@Controller
@RequiredArgsConstructor
@Slf4j
public class SceduledGameController {

    private final PublicService publicService;
    private final ScheduleService scheduleService;

    @Value("${TURN_PERIOD_SEC}")
    private long turnPeriodSec;


    @Value("${QUARTER_YEAR_TURN_PERIOD}")
    private long quarterYearTurnPeriod;
    @Value("${HALF_YEAR_BREAK_PERIOD_SEC}")
    private long halfReportPeriodSec;
    @Value("${SEASON_YEAR_PERIOD}")
    private long seasonYearPeriod;

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
        long halfYearPeriodSec = turnPeriodSec * quarterYearTurnPeriod * 2;
        long period = halfYearPeriodSec + halfReportPeriodSec;
        long offset = (halfYearPeriodSec + halfReportPeriodSec) * 2 * seasonYearPeriod - halfReportPeriodSec;
        //반기 이벤트 등록 -> 주기는 9시간 9분
        scheduleService.register("half-register", period, () -> {
            publicService.startHalfYearGame();
        });
        //반기 이벤트 삭제 이벤트 등록-> 주기는 9시간 9분, 시작은 9시간 후부터
        scheduleService.register("half-remove", halfYearPeriodSec, period, () -> {
            publicService.endHalfYearGame();
        });
        //전체 이벤트 삭제 이벤트 등록-> 주에 한 번(시즌 종료 시)만 실행되면 됨
        log.debug("끝나는 시간 "+offset+"초 뒤.. 즉! "+LocalDateTime.now().plusSeconds(offset));
        scheduleService.register("finishSeason", LocalDateTime.now(), offset,
                () -> {
                    scheduleService.removeAllSchedule();
                    publicService.startSeasonBreakTime();
                    log.debug("======시즌을 종료합니다======");
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
