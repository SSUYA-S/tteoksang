package com.welcome.tteoksang.game.controller;

import com.welcome.tteoksang.game.scheduler.ScheduleService;
import com.welcome.tteoksang.game.service.PublicService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;

import static java.time.LocalTime.now;

@Controller
//@RequiredArgsConstructor
@Slf4j
public class SceduledGameController {

    private final PublicService publicService;
    private final ScheduleService scheduleService;

    @Value("${TURN_PERIOD_SEC}")
    private long turnPeriodSec;

    @Value("${QUARTER_YEAR_TURN_PERIOD}")
    private long quarterYearTurnPeriod;
    @Value("${HALF_YEAR_BREAK_SEC}")
    private long halfYearBreakSec;
    @Value("${SEASON_YEAR_PERIOD}")
    private long seasonYearPeriod;
    @Value("${SEASON_PERIOD_HOUR}")
    private long seasonPeriodHour;
    private final String seasonKey = "SEASON-REGISTER";
    private boolean isSeasonStarted;

    SceduledGameController(PublicService publicService, ScheduleService scheduleService, @Value("${SEASON_PERIOD_HOUR}")
     long seasonPeriodHour) {
        this.publicService = publicService;
        this.scheduleService = scheduleService;
        isSeasonStarted=false;
        scheduleService.register(seasonKey, seasonPeriodHour*60*60, this::startGame);
    }


    @GetMapping("/test/season")
    public void startGame() {
        if (isSeasonStarted) {
            log.info("====already season is started====");
            return;
        }
        isSeasonStarted = true;
        publicService.initSeason();
        log.debug("=========start SEASON==========");
        long halfYearPeriodSec = turnPeriodSec * quarterYearTurnPeriod * 2;
        long period = halfYearPeriodSec + halfYearBreakSec;
        long offset = (halfYearPeriodSec + halfYearBreakSec) * 2 * seasonYearPeriod - halfYearBreakSec;
        //반기 이벤트 등록 -> 주기는 9시간 9분
        scheduleService.register("half-register", period, () -> {
            publicService.startHalfYearGame();
        });
        //반기 이벤트 삭제 이벤트 등록-> 주기는 9시간 9분, 시작은 9시간 후부터
        scheduleService.register("half-remove", halfYearPeriodSec, period, () -> {
            publicService.endHalfYearGame();
        });
        //전체 이벤트 삭제 이벤트 등록-> 주에 한 번(시즌 종료 시)만 실행되면 됨
        log.debug("끝나는 시간 " + offset + "초 뒤.. 즉! " + LocalDateTime.now().plusSeconds(offset));
        scheduleService.register("finishSeason", LocalDateTime.now(), offset,
                () -> {
                    scheduleService.removeAllScheduleExceptKey(seasonKey);
                    publicService.endSeason();
                    isSeasonStarted = false;
                    log.debug("=========end SEASON==========");
                });
    }

    // 서비스 테스트 용..

    @GetMapping("/test/season-auto")
    public ResponseEntity<Void> startGameAuto(){
        if(scheduleService.hasRegistered(seasonKey)){
            log.info("...season already sets to start automatically...");
            return ResponseEntity.badRequest().build();
        }
        scheduleService.register(seasonKey, seasonPeriodHour*60*60,()->{
            startGame();
        });
        return ResponseEntity.ok().build();
    }

    @GetMapping("/test/news")
    public void sendNewspaper() {
        publicService.createNewspaper();
    }

    @GetMapping("/test/season-end")
    public ResponseEntity<Void> endGame() {
        scheduleService.removeAllSchedule();
        publicService.endSeason();
        log.debug("=========end SEASON==========");
        log.info("FORCED SEASON-END -> Needs to start SEASON manually");
        isSeasonStarted = false;

        return ResponseEntity.ok().build();
    }


}
