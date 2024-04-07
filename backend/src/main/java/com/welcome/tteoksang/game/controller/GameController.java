package com.welcome.tteoksang.game.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.game.dto.Chat;
import com.welcome.tteoksang.game.dto.GameMessage;
import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.game.dto.res.WebSocketIdRes;
import com.welcome.tteoksang.game.dto.result.TestExample;
import com.welcome.tteoksang.game.dto.result.end.FinalResult;
import com.welcome.tteoksang.game.dto.result.half.Half;
import com.welcome.tteoksang.game.dto.result.offline.OfflineReport;
import com.welcome.tteoksang.game.dto.result.quarter.Quarter;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
import com.welcome.tteoksang.game.service.ChatService;
import com.welcome.tteoksang.game.service.ReportService;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.type.MessageType;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@Controller
@Slf4j
@RequiredArgsConstructor
public class GameController {

    private final RedisService redisService;
    private final ChatService chatService;
    private final ReportService reportService;
    private final UserService userService;
    private final ServerInfo serverInfo;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @GetMapping("/web-socket")
    public ResponseEntity<WebSocketIdRes> createWebSocketId(@AuthenticationPrincipal User user) {
        String webSocketUUID = UUID.randomUUID().toString();

        String key = RedisPrefix.WEBSOCKET.prefix() + user.getUserId();
        // 레디스에 webSocketId 저장
        redisService.setValues(key, webSocketUUID);

        return ResponseEntity.ok().
                body(
                        WebSocketIdRes.builder()
                                .webSocketId(webSocketUUID)
                                .build()
                );
    }

    @GetMapping("/quarter/{webSocketId}")
    public void sendQuarter(@PathVariable("webSocketId") String webSocketId, @AuthenticationPrincipal User user) {
//        String logData = TestExample.quarter;
//        ObjectMapper mapper = new ObjectMapper();
//        boolean isSuccess = false;
//        Quarter message = null;
//        try {
//            message = mapper.readValue(logData, Quarter.class);
//            isSuccess = true;
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        GameMessageRes quarterResult = GameMessageRes.builder()
//                .type(MessageType.QUARTER_REPORT)
//                .isSuccess(isSuccess)
//                .body(message)
//                .build();
//
//        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, quarterResult);

        GameMessageRes quarterResult = reportService.sendQuarterResult(user.getUserId());
        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, quarterResult);
    }

    @GetMapping("/half/{webSocketId}")
    public void sendHalf(@PathVariable("webSocketId") String webSocketId) {
        String responseData = TestExample.half;
        ObjectMapper mapper = new ObjectMapper();
        boolean isSuccess = false;
        Half message = null;
        try {
            message = mapper.readValue(responseData, Half.class);
            isSuccess = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        GameMessageRes halfResult = GameMessageRes.builder()
                .type(MessageType.HALF_REPORT)
                .isSuccess(isSuccess)
                .body(message)
                .build();

        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, halfResult);
    }

    @GetMapping("/final/{webSocketId}")
    public void sendFinal(@PathVariable("webSocketId") String webSocketId) {
        String responseData = TestExample.finalReport;
        ObjectMapper mapper = new ObjectMapper();
        boolean isSuccess = false;
        FinalResult message = null;
        try {
            message = mapper.readValue(responseData, FinalResult.class);
            isSuccess = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        GameMessageRes finalResult = GameMessageRes.builder()
                .type(MessageType.FINAL_REPORT)
                .isSuccess(isSuccess)
                .body(message)
                .build();

        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, finalResult);
    }

    @GetMapping("/offline/{webSocketId}")
    public void sendOffline(@PathVariable("webSocketId") String webSocketId) {
        String ResponseData = TestExample.offlineData;
        ObjectMapper mapper = new ObjectMapper();
        boolean isSuccess = false;
        OfflineReport message = null;
        try {
            message = mapper.readValue(ResponseData, OfflineReport.class);
            isSuccess = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        GameMessageRes offlineResult = GameMessageRes.builder()
                .type(MessageType.OFFLINE_REPORT)
                .isSuccess(isSuccess)
                .body(message)
                .build();

        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, offlineResult);
    }

    // TODO: 태운
    @GetMapping("/quarter/twnkm7089")
    public void sendQuarterTwnkm() {
        User twn = userService.findTwn("twnkm7089@gmail.com");
        String userId = twn.getUserId();

        String twnKey = RedisPrefix.WEBSOCKET.prefix() + userId;
        String webSocketId = (String) redisService.getValues(twnKey);
        String responseData = TestExample.half;
        ObjectMapper mapper = new ObjectMapper();
        boolean isSuccess = false;
        Half message = null;
        try {
            message = mapper.readValue(responseData, Half.class);
            isSuccess = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        GameMessageRes halfResult = GameMessageRes.builder()
                .type(MessageType.HALF_REPORT)
                .isSuccess(isSuccess)
                .body(message)
                .build();

        GameMessageRes quarterResult = reportService.sendQuarterResult(userId);
        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, quarterResult);
    }

    // TODO: 태운
    @GetMapping("/half/twnkm7089")
    public void sendHalfTwnkm() {
        User twn = userService.findTwn("twnkm7089@gmail.com");
        String userId = twn.getUserId();

        String twnKey = RedisPrefix.WEBSOCKET.prefix() + userId;
        String webSocketId = (String) redisService.getValues(twnKey);
        String responseData = TestExample.half;
        ObjectMapper mapper = new ObjectMapper();
        boolean isSuccess = false;
        Half message = null;
        try {
            message = mapper.readValue(responseData, Half.class);
            isSuccess = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        GameMessageRes halfResult = GameMessageRes.builder()
                .type(MessageType.HALF_REPORT)
                .isSuccess(isSuccess)
                .body(message)
                .build();

        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, halfResult);
    }

    @GetMapping("/event/twnkm7089")
    public ResponseEntity<?> sendEventTwnkm() {
        User twn = userService.findTwn("mnm3657@gmail.com");
        String userId = twn.getUserId();

        String twnKey = RedisPrefix.WEBSOCKET.prefix() + userId;
        String webSocketId = (String) redisService.getValues(twnKey);

        GameMessageRes halfResult = GameMessageRes.builder()
                .type(MessageType.GET_EVENT_LIST)
                .isSuccess(true)
                .body(serverInfo.getSpecialEventIdList())
                .build();

        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, halfResult);
        return ResponseEntity.ok().
                body(serverInfo.getSpecialEventIdList());
    }


    @MessageMapping("/chat") // 클라이언트에서 보낸 메시지를 받을 메서드 지정
    @SendTo("/topic/chat") // 메서드가 처리한 결과를 보낼 목적지 지정
    public GameMessage handleChatMessage(@Payload GameMessage gameMessage,
                                         SimpMessageHeaderAccessor headerAccessor) {
          /* @DestinationVariable: 메시지의 목적지에서 변수를 추출
             @Payload: 메시지 본문(body)의 내용을 메서드의 인자로 전달할 때 사용
                      (클라이언트가 JSON 형태의 메시지를 보냈다면, 이를 GameMessage 객체로 변환하여 메서드에 전달)
          */
        String userId = (String) headerAccessor.getSessionAttributes().get("userId");
        Map<String, Object> body = (Map<String, Object>) gameMessage.getBody();
        String message = (String) body.get("message");
        log.debug("메세지 내용 :{}", message);
        Chat chat = chatService.sendChat(userId, (Map<String, Object>) gameMessage.getBody());
        if (chat == null) return null;
        gameMessage.setBody(chat);
        return gameMessage;
    }
}
