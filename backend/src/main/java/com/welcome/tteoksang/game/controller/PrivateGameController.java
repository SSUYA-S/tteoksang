package com.welcome.tteoksang.game.controller;

import com.welcome.tteoksang.game.dto.req.GameMessageReq;
import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.resource.type.MessageType;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.LinkedHashMap;

@Controller
@Slf4j
@RequiredArgsConstructor
public class PrivateGameController {
    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/private/{webSocketId}") // 클라이언트에서 보낸 메시지를 받을 메서드 지정
    @SendTo("/topic/private/{webSocketId}") // 메서드가 처리한 결과를 보낼 목적지 지정
    public GameMessageRes handlePrivateMessage(@DestinationVariable("webSocketId") String webSocketId,
                                               @Payload GameMessageReq gameMessageReq, Principal principal) {
    /* @DestinationVariable: 메시지의 목적지에서 변수를 추출
        @Payload: 메시지 본문(body)의 내용을 메서드의 인자로 전달할 때 사용
        (클라이언트가 JSON 형태의 메시지를 보냈다면, 이를 GameMessage 객체로 변환하여 메서드에 전달)
    */
        // 유저 정보
        User user = (User) ((Authentication) principal).getPrincipal();
        log.debug("UserName : {}, webSocketId : {}", user.getUserNickname(), webSocketId);
        LinkedHashMap<String, Object> body = (LinkedHashMap<String, Object>) gameMessageReq.getBody();
        Boolean isSuccess = false;
        switch (gameMessageReq.getType()) {
            case CHANGE_TITLE: {
                // 칭호 변경
                Integer titleId = (Integer) body.get("titleId");
                userService.updateUserTitle(titleId, user);
                isSuccess = true;
                break;
            }
            case BUY_PRODUCT: {

            }
            case SELL_PRODUCT: {

            }
            case UPGRADE_WAREHOUSE: {

            }
            case UPGRADE_BROKER: {

            }
            case UPGRADE_VEHICLE: {

            }
            // 처리
            default:
                // 정의되지 않은 요청
        }

        // 클라이언트에게 응답 메시지 보내기
        GameMessageRes gameMessageRes = new GameMessageRes();
        gameMessageRes.setType(MessageType.CHANGE_TITLE);
        gameMessageRes.setIsSuccess(isSuccess);
        gameMessageRes.setBody(body); // 클라이언트에게 받은 메시지 그대로 반환
//        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, gameMessageRes);

        return gameMessageRes; // 받은 메시지 그대로 반환
    }
}
