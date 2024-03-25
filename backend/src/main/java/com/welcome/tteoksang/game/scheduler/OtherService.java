package com.welcome.tteoksang.game.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OtherService {
    private final ScheduleService schedulerService;

    public void test(String scheduleId){
//        schedulerService.startGame(2000,5000);
//        schedulerService.register(scheduleId);
    }

    public void test2(String scheduleId){
//        schedulerService.remove(scheduleId);
//        schedulerService.endGame();
    }

}