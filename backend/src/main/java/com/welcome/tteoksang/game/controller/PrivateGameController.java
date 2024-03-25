package com.welcome.tteoksang.game.controller;

import com.welcome.tteoksang.game.dto.RedisGameInfo;
import com.welcome.tteoksang.game.dto.TotalInfo;
import com.welcome.tteoksang.game.dto.UserWarehouseInfo;
import com.welcome.tteoksang.game.dto.req.GameMessageReq;
import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.user.dto.UserInfo;
import com.welcome.tteoksang.user.exception.TitleNotExistException;
import com.welcome.tteoksang.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;

@Controller
@Slf4j
@RequiredArgsConstructor
public class PrivateGameController {
    private final UserService userService;
    private final RedisService redisService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/private/{webSocketId}") // 클라이언트에서 보낸 메시지를 받을 메서드 지정
    @SendTo("/topic/private/{webSocketId}") // 메서드가 처리한 결과를 보낼 목적지 지정
    public GameMessageRes handlePrivateMessage(@DestinationVariable("webSocketId") String webSocketId,
                                               @Payload GameMessageReq gameMessageReq,
                                               SimpMessageHeaderAccessor headerAccessor) {
    /* @DestinationVariable: 메시지의 목적지에서 변수를 추출
        @Payload: 메시지 본문(body)의 내용을 메서드의 인자로 전달할 때 사용
        (클라이언트가 JSON 형태의 메시지를 보냈다면, 이를 GameMessage 객체로 변환하여 메서드에 전달)
    */
        // 유저 정보 -> 여기서 받아오면 인게임 내부에서 변경 시 변경된 내용이 반영이 되어있지 않다.
//        User user = (User) ((Authentication) principal).getPrincipal();
        // 세션 속성에서 userId 추출
        String userId = (String) headerAccessor.getSessionAttributes().get("userId");
        log.debug("메세지 내부 핸드 셰이크 유저 아이디: {}", userId);
        String userInfoKey = RedisPrefix.USERINFO.prefix() + userId;

        // 레디스에서 유저 정보 가져오기
        UserInfo userInfo = (UserInfo) redisService.getValues(userInfoKey);
        log.debug("UserName : {}, webSocketId : {}", userInfo.getNickname(), webSocketId);

        LinkedHashMap<String, Object> body = gameMessageReq.getBody();
        Object responseBody = body;
        boolean isSuccess = false;

        // 레디스에 있는 게임 정보 불러오기
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        RedisGameInfo redisGameInfo = null;
        if (redisService.hasKey(redisGameInfoKey)) {
            redisGameInfo = (RedisGameInfo) redisService.getValues(redisGameInfoKey);
        }

        switch (gameMessageReq.getType()) {
            case CHANGE_TITLE: {
                // 칭호 변경
                Integer titleId = (Integer) body.get("titleId");
                try {
                    userService.updateUserTitle(titleId, userId);
                    isSuccess = true;
                } catch (TitleNotExistException e) {
                    log.error("없는 칭호 입니다.");
                }
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
            case GET_TOTAL_INFO: {
                // TODO:서버 게임 정보 불러오기

                // TODO:레디스에 있는 개인별 게임 정보 반영
                if (redisGameInfo != null) {
                    responseBody = TotalInfo.builder()
                            .gold(redisGameInfo.getGold())
                            .privateEventId(redisGameInfo.getPrivateEventId())
                            .specialEventId("없음")   // 서버의 특수 이벤트
                            .inGameTime(LocalDateTime.now().toString())
                            .turnStartTime(LocalDateTime.now().toString())    // 턴 시작 시간 => 서버에서 가져옴
                            .turn(1)    // 서버의 턴 정보
                            .themeId(userInfo.getThemeId())
                            .products(redisGameInfo.getProducts())
                            .productInfoList(new ArrayList<>())
                            .buyAbleProductIdList(new ArrayList<>())
                            .purchasedQuantity(redisGameInfo.getPurchaseQuantity())
                            .warehouseLevel(redisGameInfo.getWarehouseLevel())
                            .vehicleLevel(redisGameInfo.getVehicleLevel())
                            .brokerLevel(redisGameInfo.getBrokerLevel())
                            .build();
                    isSuccess = true;
                } else {
                    log.error("없는 유저 입니다.");
                }
                break;
            }
            case GET_WAREHOUSE_INFO: {
                if (redisGameInfo != null) {
                    responseBody = UserWarehouseInfo.builder()
                            .warehouseLevel(redisGameInfo.getWarehouseLevel())
                            .vehicleLevel(redisGameInfo.getVehicleLevel())
                            .brokerLevel(redisGameInfo.getBrokerLevel())
                            .products(redisGameInfo.getProducts())
                            .build();
                    isSuccess = true;
                } else {
                    log.error("없는 유저 입니다.");
                }
                break;
            }
            // 처리
            default:
                // 정의되지 않은 요청
        }

        // 클라이언트에게 응답 메시지 보내기
        GameMessageRes gameMessageRes = new GameMessageRes();
        gameMessageRes.setType(gameMessageReq.getType());
        gameMessageRes.setIsSuccess(isSuccess);
        gameMessageRes.setBody(responseBody); // 클라이언트에게 받은 메시지 그대로 반환
//        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, gameMessageRes);

        return gameMessageRes; // 받은 메시지 그대로 반환
    }
}
