package com.welcome.tteoksang.game.controller;

import com.welcome.tteoksang.game.dto.*;
import com.welcome.tteoksang.game.dto.req.GameMessageReq;
import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.game.service.PrivateInfoService;
import com.welcome.tteoksang.game.service.PrivateInteractionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.*;

@Controller
@Slf4j
@RequiredArgsConstructor
public class PrivateGameController {

    private final PrivateInteractionService privateInteractionService;
    private final PrivateInfoService privateInfoService;

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
        GameMessageInfo gameMessageInfo;

        // 메세지 타입에 따른 분기
        switch (gameMessageReq.getType()) {
            // 칭호 변경
            case CHANGE_TITLE: {
                Integer titleId = (Integer) body.get("titleId");
                gameMessageInfo = privateInteractionService.changeTitle(body, titleId, userId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }
            // 상품 구매
            case BUY_PRODUCT: {
                gameMessageInfo = privateInteractionService.buyProduct(body, userId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }
            // 상품 판매
            case SELL_PRODUCT: {
                gameMessageInfo = privateInteractionService.sellProduct(body, userId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }
            // 창고 업그레이드
            case UPGRADE_WAREHOUSE: {
                gameMessageInfo = privateInteractionService.upgradeWarehouse(body, userId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }
            // 교환소 업그레이드
            case UPGRADE_BROKER: {
                gameMessageInfo = privateInteractionService.upgradeBroker(body, userId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }
            // 운송수단 업그레이드
            case UPGRADE_VEHICLE: {
                gameMessageInfo = privateInteractionService.upgradeVehicle(body, userId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }
            // 게임 초기 정보 불러오기
            case GET_TOTAL_INFO: {
                gameMessageInfo = privateInfoService.getTotalInfo(body, userId, webSocketId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }
            // 창고 조회
            case GET_WAREHOUSE_INFO: {
                gameMessageInfo = privateInfoService.getWarehouseInfo(body, userId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }
            // 인프라 정보 조회
            case GET_INFRA_LEVEL: {
                gameMessageInfo = privateInfoService.getInfraLevel(body, userId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }
            // 현재 소지금 조회
            case GET_MY_GOLD: {
                gameMessageInfo = privateInfoService.getMyGold(body, userId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }
            // 현재 개인 이벤트 조회
            case GET_PRIVATE_EVENT: {
                gameMessageInfo = privateInfoService.getPrivateEvent(body, userId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }
            // 서버 시간 조회
            case GET_INGAME_TIME: {
                gameMessageInfo = privateInfoService.getInGameTime(body, userId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }
            // 게임 종료
            case QUIT_GAME: {
                // 로그아웃 처리와 같음

            }
            // 파산 신청
            case GIVEUP_GAME: {

            }
            //
            case ALERT_PLAYTIME: {
                gameMessageInfo = privateInfoService.alertPlayTime(body, userId);
                responseBody = gameMessageInfo.getBody();
                isSuccess = gameMessageInfo.getIsSuccess();
                break;
            }

            // 정의되지 않은 요청
            default: {
                break;
            }
        }

        // 클라이언트에게 응답 메시지 보내기
        return GameMessageRes.builder()
                .type(gameMessageReq.getType())
                .isSuccess(isSuccess)
                .body(responseBody)
                .build();
//        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, gameMessageRes);
    }
}
