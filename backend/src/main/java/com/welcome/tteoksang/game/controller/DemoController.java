package com.welcome.tteoksang.game.controller;

import com.welcome.tteoksang.game.service.DemoServiceImpl;
import com.welcome.tteoksang.game.service.PublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequiredArgsConstructor
@RequestMapping("/we1c0mettoeksang")
public class DemoController {

    private final PublicService publicService;
    private final DemoServiceImpl demoService;

    @GetMapping("/set-turn/{turnNumber}")
    public void setTurn(@PathVariable int turnNumber){
        // turnNumber로 턴 정보 세팅
        // 그 전 값으로 적용중 이벤트 및 뉴스 세팅
        demoService.initDemo();

    }
    @GetMapping("/next-turn")
    public void nextTurn(){

    }
    @GetMapping("/take-break")
    public void takeBreak(){

    }
    @GetMapping("/finish-break")
    public void finishBreak(){

    }
}
