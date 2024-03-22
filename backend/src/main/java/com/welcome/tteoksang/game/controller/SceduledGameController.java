package com.welcome.tteoksang.game.controller;

import com.welcome.tteoksang.game.dto.Chat;
import com.welcome.tteoksang.game.dto.GameMessage;
import com.welcome.tteoksang.resource.type.MessageType;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import static java.time.LocalTime.now;
//@Controller
@RequiredArgsConstructor
public class SceduledGameController {

    private final SimpMessageSendingOperations sendingOperations;
    @Scheduled(fixedDelay = 1000*10) //10초마다 chat 보내는 예제
    // 초, 분, 시, 일, 월, 요일
    //@Scheduled(cron = "0 0 7 * * *")
    public void sendPeriodicMessage() {
        GameMessage message = new GameMessage();
        message.setType(MessageType.CHAT);
        message.setBody(Chat.builder()
                .message("서버에서 왔슈 "+now() )
                .profileFrameId(1)
                .profileIconId(1)
                .userNickname("server")
                .build());

        sendingOperations.convertAndSend("/topic/chat", message);
    }
}
