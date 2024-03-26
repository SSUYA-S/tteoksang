package com.welcome.tteoksang.game.controller;

import com.welcome.tteoksang.game.dto.*;
import com.welcome.tteoksang.game.dto.req.GameMessageReq;
import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.game.dto.TotalInfo;
import com.welcome.tteoksang.game.exception.BrokerNotExistException;
import com.welcome.tteoksang.game.exception.VehicleNotExistException;
import com.welcome.tteoksang.game.exception.WarehouseNotExistException;
import com.welcome.tteoksang.game.service.PrivateService;
import com.welcome.tteoksang.user.exception.TitleNotExistException;
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
import java.util.*;

@Controller
@Slf4j
@RequiredArgsConstructor
public class PrivateGameController {

    private final PrivateService privateService;
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

        // 초기화
        LinkedHashMap<String, Object> body = gameMessageReq.getBody();
        Object responseBody = body;
        boolean isSuccess = false;

        // 메세지 타입에 따른 분기
        switch (gameMessageReq.getType()) {
            // 칭호 변경
            case CHANGE_TITLE: {
                Integer titleId = (Integer) body.get("titleId");
                Object[] result = privateService.changeTitle(body, titleId, userId);
                responseBody = result[0];
                isSuccess = (boolean) result[1];
                break;
            }
            // 상품 구매
            case BUY_PRODUCT: {

            }
            // 상품 판매
            case SELL_PRODUCT: {

            }
            // 창고 업그레이드
            case UPGRADE_WAREHOUSE: {
                Object[] result = privateService.upgradeWarehouse(body, userId);
                responseBody = result[0];
                isSuccess = (boolean) result[1];
                break;
            }
            case UPGRADE_BROKER: {
                Object[] result = privateService.upgradeBroker(body, userId);
                responseBody = result[0];
                isSuccess = (boolean) result[1];
                break;
            }
            case UPGRADE_VEHICLE: {
                Object[] result = privateService.upgradeVehicle(body, userId);
                responseBody = result[0];
                isSuccess = (boolean) result[1];
                break;
            }
            case GET_TOTAL_INFO: {
                // TODO:서버 게임 정보 불러오기

                // TODO:레디스에 있는 개인별 게임 정보 반영
                Object[] result = privateService.getTotalInfo(body, userId, webSocketId);
                responseBody = result[0];
                isSuccess = (boolean) result[1];
                break;
            }
            case GET_WAREHOUSE_INFO: {
                Object[] result = privateService.getWarehouseInfo(body, userId);
                responseBody = result[0];
                isSuccess = (boolean) result[1];
                break;
            }
            case GET_INFRA_LEVEL: {
                Object[] result = privateService.getInfraLevel(body, userId);
                responseBody = result[0];
                isSuccess = (boolean) result[1];
                break;
            }
            case GET_MY_GOLD: {
                Object[] result = privateService.getMyGold(body, userId);
                responseBody = result[0];
                isSuccess = (boolean) result[1];
                break;
            }
            case GET_PRIVATE_EVENT: {
                Object[] result = privateService.getPrivateEvent(body, userId);
                responseBody = result[0];
                isSuccess = (boolean) result[1];
                break;
            }
            case GET_INGAME_TIME: {
                //TODO: 서버에 있는 게임 시간 불러오기

                Object[] result = privateService.getInGameTime(body, userId);
                responseBody = result[0];
                isSuccess = (boolean) result[1];
                break;
            }
            case QUIT_GAME: {
                // 로그아웃 처리와 같음

            }
            case GIVEUP_GAME: {

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
