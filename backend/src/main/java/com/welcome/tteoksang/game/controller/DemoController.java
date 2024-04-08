package com.welcome.tteoksang.game.controller;

import com.welcome.tteoksang.game.service.DemoService;
import com.welcome.tteoksang.game.service.PublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

//@Controller
@RequiredArgsConstructor
//@RequestMapping("/we1c0mettoeksang")
public class DemoController {

    private final PublicService publicService;
    private final DemoService demoService;

    @GetMapping("/init-turn")
    public ResponseEntity<Void> initTurn() {
        demoService.initDemo();

        return ResponseEntity.ok().build();
    }

    @GetMapping("/next-turn")
    public ResponseEntity<Void> nextTurn() {
        demoService.nextTurn();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/take-break")
    public ResponseEntity<Void> takeBreak() {
        demoService.takeBreak();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/finish-break")
    public ResponseEntity<Void> finishBreak() {
        demoService.finishBreak();
        return ResponseEntity.ok().build();
    }
}
