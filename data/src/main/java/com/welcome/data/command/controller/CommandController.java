package com.welcome.data.command.controller;

import com.welcome.data.kafka.KafkaManager;
import com.welcome.data.kafka.LogConsumer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/command")
@RequiredArgsConstructor
@Slf4j
public class CommandController {

    private final LogConsumer logConsumer;
    private final KafkaManager kafkaManager;

    // 반기 시작
    @GetMapping("/start")
    public ResponseEntity<Void> halfStart(@RequestParam int seasonId, @RequestParam int halfSeasonId) {
        // 저장 경로 지정
        logConsumer.setSeasonId(seasonId);
        logConsumer.setHalfSeasonId(halfSeasonId);
        log.debug("seasonId: {}, halfSeasonId: {}", seasonId, halfSeasonId);

        // 컨슈머 동작 시작
        kafkaManager.resumeAll();

        return ResponseEntity.ok().build();
    }

    // 반기 끝
    @GetMapping("/end")
    public ResponseEntity<Void> halfEnd() {
        log.debug("end");
        //남은 로그 저장
        logConsumer.flush();

        // 컨슈머 pause
        kafkaManager.pauseAll();

        // airflow dag 시작

        return ResponseEntity.ok().build();
    }
}
