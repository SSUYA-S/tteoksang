package com.welcome.tteoksang.game.controller;

import com.welcome.tteoksang.game.dto.GameMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class GameController {
    @MessageMapping("/private/{websocketId}") // 클라이언트에서 보낸 메시지를 받을 메서드 지정
    @SendTo("/topic/private/{websocketId}") // 메서드가 처리한 결과를 보낼 목적지 지정
    public GameMessage handlePrivateMessage(@DestinationVariable String websocketId, @Payload GameMessage gameMessage, Principal principal) {
          /* @DestinationVariable: 메시지의 목적지에서 변수를 추출
             @Payload: 메시지 본문(body)의 내용을 메서드의 인자로 전달할 때 사용
                      (클라이언트가 JSON 형태의 메시지를 보냈다면, 이를 GameMessage 객체로 변환하여 메서드에 전달)
          */
        switch (gameMessage.getType()){

        }
        return gameMessage;
    }


    @MessageMapping("/chat/{websocketId}") // 클라이언트에서 보낸 메시지를 받을 메서드 지정
    @SendTo("/topic/chat") // 메서드가 처리한 결과를 보낼 목적지 지정
    public GameMessage handleChatMessage(@DestinationVariable String websocketId, @Payload GameMessage gameMessage, Principal principal) {
          /* @DestinationVariable: 메시지의 목적지에서 변수를 추출
             @Payload: 메시지 본문(body)의 내용을 메서드의 인자로 전달할 때 사용
                      (클라이언트가 JSON 형태의 메시지를 보냈다면, 이를 GameMessage 객체로 변환하여 메서드에 전달)
          */

        return gameMessage;
    }
}
