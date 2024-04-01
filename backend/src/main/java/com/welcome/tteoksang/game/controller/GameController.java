package com.welcome.tteoksang.game.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.game.dto.Chat;
import com.welcome.tteoksang.game.dto.GameMessage;
import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.game.dto.res.WebSocketIdRes;
import com.welcome.tteoksang.game.dto.result.TestExample;
import com.welcome.tteoksang.game.dto.result.end.FinalResult;
import com.welcome.tteoksang.game.dto.result.half.Half;
import com.welcome.tteoksang.game.dto.result.quarter.Quarter;
import com.welcome.tteoksang.game.service.ChatService;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.type.MessageType;
import com.welcome.tteoksang.user.dto.User;
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
    public void sendQuater(@PathVariable("webSocketId") String webSocketId) {
        String logData = TestExample.quarter;
        ObjectMapper mapper = new ObjectMapper();
        boolean isSuccess = false;
        Quarter message = null;
        try {
            message = mapper.readValue(logData, Quarter.class);
            isSuccess = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        GameMessageRes quarterResult = GameMessageRes.builder()
                .type(MessageType.QUARTER_REPORT)
                .isSuccess(isSuccess)
                .body(message)
                .build();

        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, quarterResult);
    }

    @GetMapping("/half/{webSocketId}")
    public void sendHalf(@PathVariable("webSocketId") String webSocketId) {
        String logData = TestExample.half;
        ObjectMapper mapper = new ObjectMapper();
        boolean isSuccess = false;
        Half message = null;
        try {
            message = mapper.readValue(logData, Half.class);
            isSuccess = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        GameMessageRes quarterResult = GameMessageRes.builder()
                .type(MessageType.HALF_REPORT)
                .isSuccess(isSuccess)
                .body(message)
                .build();

        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, quarterResult);
    }

    @GetMapping("/final/{webSocketId}")
    public void sendFinal(@PathVariable("webSocketId") String webSocketId) {
        String logData = TestExample.finalReport;
        ObjectMapper mapper = new ObjectMapper();
        boolean isSuccess = false;
        FinalResult message = null;
        try {
            message = mapper.readValue(logData, FinalResult.class);
            isSuccess = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        GameMessageRes quarterResult = GameMessageRes.builder()
                .type(MessageType.FINAL_REPORT)
                .isSuccess(isSuccess)
                .body(message)
                .build();

        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, quarterResult);
    }

    @GetMapping("/offline/{webSocketId}")
    public void sendOffline(@PathVariable("webSocketId") String webSocketId) {
        String logData = "{\n" +
                "    \"lastGameTurn\": 78,\n" +
                "    \"rentFeeInfo\": {\n" +
                "        \"billType\": \"overdue\",\n" +
                "        \"rentFee\": 10000,\n" +
                "        \"productList\": [\n" +
                "            {\n" +
                "                \"productId\": 2,\n" +
                "                \"productQuantity\": 20\n" +
                "            },\n" +
                "            {\n" +
                "                \"productId\": 3,\n" +
                "                \"productQuantity\": 5\n" +
                "            }\n" +
                "        ]\n" +
                "    },\n" +
                "    \"halfReport\": {\n" +
                "        \"totalProductIncome\": 5000000,\n" +
                "        \"totalProductOutcome\": 2500000,\n" +
                "        \"totalBrokerFee\": 120000,\n" +
                "        \"totalUpgradeFee\": 50000,\n" +
                "        \"totalRentFee\": 30000,\n" +
                "        \"eventBonus\": 100000,\n" +
                "        \"participantCount\": 500,\n" +
                "        \"rankInfoList\": [\n" +
                "            {\n" +
                "                \"rankName\": \"판매왕\",\n" +
                "                \"rankDescription\": \"가장 많은 순수익을 얻은 사람(반기 기준)\",\n" +
                "                \"theFirstUserInfo\": {\n" +
                "                    \"userNickname\": \"일론 머스크\",\n" +
                "                    \"profileIconId\": 3,\n" +
                "                    \"profileFrameId\": 1\n" +
                "                },\n" +
                "                \"theFirstRecord\": 10000000,\n" +
                "                \"myRank\": 53,\n" +
                "                \"myRecord\": 2500000\n" +
                "            },\n" +
                "            {\n" +
                "                \"rankName\": \"부자\",\n" +
                "                \"rankDescription\": \"현재 보유 금액\",\n" +
                "                \"theFirstUserInfo\": {\n" +
                "                    \"userNickname\": \"젠슨 황\",\n" +
                "                    \"profileIconId\": 2,\n" +
                "                    \"profileFrameId\": 2\n" +
                "                },\n" +
                "                \"theFirstRecord\": 210000000,\n" +
                "                \"myRank\": 112,\n" +
                "                \"myRecord\": 10000000\n" +
                "            },\n" +
                "            {\n" +
                "                \"rankName\": \"큰 손\",\n" +
                "                \"rankDescription\": \"한 번에 돈을 제일 많이 쓴 사람(반기 기준)\",\n" +
                "                \"theFirstUserInfo\": {\n" +
                "                    \"userNickname\": \"김flex\",\n" +
                "                    \"profileIconId\": 1,\n" +
                "                    \"profileFrameId\": 1\n" +
                "                },\n" +
                "                \"theFirstRecord\": 1000000,\n" +
                "                \"myRank\": 12,\n" +
                "                \"myRecord\": 500000\n" +
                "            },\n" +
                "            {\n" +
                "                \"rankName\": \"벼락부자\",\n" +
                "                \"rankDescription\": \"한 번에 제일 많은 돈을 번 사람(반기 기준)\",\n" +
                "                \"theFirstUserInfo\": {\n" +
                "                    \"userNickname\": \"단타 장인\",\n" +
                "                    \"profileIconId\": 3,\n" +
                "                    \"profileFrameId\": 3\n" +
                "                },\n" +
                "                \"theFirstRecord\": 5000000,\n" +
                "                \"myRank\": 138,\n" +
                "                \"myRecord\": 500000\n" +
                "            },\n" +
                "            {\n" +
                "                \"rankName\": \"떡상\",\n" +
                "                \"rankDescription\": \"가장 높은 수익률(반기 기준)\",\n" +
                "                \"theFirstUserInfo\": {\n" +
                "                    \"userNickname\": \"제노\",\n" +
                "                    \"profileIconId\": 1,\n" +
                "                    \"profileFrameId\": 2\n" +
                "                },\n" +
                "                \"theFirstRecord\": 123.5,\n" +
                "                \"myRank\": 1,\n" +
                "                \"myRecord\": 123.5\n" +
                "            }\n" +
                "        ],\n" +
                "        \"tteoksangStatistics\": {\n" +
                "            \"values\": [\n" +
                "                {\n" +
                "                    \"productId\": 3,\n" +
                "                    \"value\": 12.5\n" +
                "                },\n" +
                "                {\n" +
                "                    \"productId\": 7,\n" +
                "                    \"value\": 11.2\n" +
                "                },\n" +
                "                {\n" +
                "                    \"productId\": 5,\n" +
                "                    \"value\": 9.3\n" +
                "                }\n" +
                "            ]\n" +
                "        },\n" +
                "        \"tteokrockStatistics\": {\n" +
                "            \"values\": [\n" +
                "                {\n" +
                "                    \"productId\": 3,\n" +
                "                    \"value\": -20.3\n" +
                "                },\n" +
                "                {\n" +
                "                    \"productId\": 1,\n" +
                "                    \"value\": -17.2\n" +
                "                },\n" +
                "                {\n" +
                "                    \"productId\": 6,\n" +
                "                    \"value\": -11.3\n" +
                "                }\n" +
                "            ]\n" +
                "        },\n" +
                "        \"bestSellerStatistics\": {\n" +
                "            \"values\": [\n" +
                "                {\n" +
                "                    \"productId\": 3,\n" +
                "                    \"value\": 15000000\n" +
                "                },\n" +
                "                {\n" +
                "                    \"productId\": 7,\n" +
                "                    \"value\": 12000000\n" +
                "                },\n" +
                "                {\n" +
                "                    \"productId\": 1,\n" +
                "                    \"value\": 9000000\n" +
                "                }\n" +
                "            ]\n" +
                "        },\n" +
                "        \"achievementList\": [{ \"achievementId\": 2 }, { \"achievementId\": 5 }]\n" +
                "    },\n" +
                "    \"quarterReport\": {\n" +
                "        \"quarterProfit\": 1000000,\n" +
                "        \"rentFee\": 10000,\n" +
                "        \"inProductList\": [3, 4, 5, 7, 8],\n" +
                "        \"titleId\": 1\n" +
                "    },\n" +
                "    \"participantCount\": 1000,\n" +
                "    \"rankInfoList\": [\n" +
                "        {\n" +
                "            \"rankName\": \"판매왕\",\n" +
                "            \"rankDescription\": \"가장 많은 순수익을 얻은 사람(반기 기준)\",\n" +
                "            \"theFirstUserInfo\": {\n" +
                "                \"userNickname\": \"일론 머스크\",\n" +
                "                \"profileIconId\": 3,\n" +
                "                \"profileFrameId\": 1\n" +
                "            },\n" +
                "            \"theFirstRecord\": 12000000,\n" +
                "            \"myRank\": 851,\n" +
                "            \"myRecord\": 0\n" +
                "        },\n" +
                "        {\n" +
                "            \"rankName\": \"부자\",\n" +
                "            \"rankDescription\": \"현재 보유 금액\",\n" +
                "            \"theFirstUserInfo\": {\n" +
                "                \"userNickname\": \"젠슨 황\",\n" +
                "                \"profileIconId\": 2,\n" +
                "                \"profileFrameId\": 2\n" +
                "            },\n" +
                "            \"theFirstRecord\": 230000000,\n" +
                "            \"myRank\": 189,\n" +
                "            \"myRecord\": 10000000\n" +
                "        },\n" +
                "        {\n" +
                "            \"rankName\": \"큰 손\",\n" +
                "            \"rankDescription\": \"한 번에 돈을 제일 많이 쓴 사람(반기 기준)\",\n" +
                "            \"theFirstUserInfo\": {\n" +
                "                \"userNickname\": \"김flex\",\n" +
                "                \"profileIconId\": 1,\n" +
                "                \"profileFrameId\": 1\n" +
                "            },\n" +
                "            \"theFirstRecord\": 3000000,\n" +
                "            \"myRank\": 851,\n" +
                "            \"myRecord\": 0\n" +
                "        },\n" +
                "        {\n" +
                "            \"rankName\": \"벼락부자\",\n" +
                "            \"rankDescription\": \"한 번에 제일 많은 돈을 번 사람(반기 기준)\",\n" +
                "            \"theFirstUserInfo\": {\n" +
                "                \"userNickname\": \"단타 장인\",\n" +
                "                \"profileIconId\": 3,\n" +
                "                \"profileFrameId\": 3\n" +
                "            },\n" +
                "            \"theFirstRecord\": 7000000,\n" +
                "            \"myRank\": 851,\n" +
                "            \"myRecord\": 0\n" +
                "        },\n" +
                "        {\n" +
                "            \"rankName\": \"떡상\",\n" +
                "            \"rankDescription\": \"가장 높은 수익률(반기 기준)\",\n" +
                "            \"theFirstUserInfo\": {\n" +
                "                \"userNickname\": \"제노\",\n" +
                "                \"profileIconId\": 1,\n" +
                "                \"profileFrameId\": 2\n" +
                "            },\n" +
                "            \"theFirstRecord\": 131.5,\n" +
                "            \"myRank\": 500,\n" +
                "            \"myRecord\": 0\n" +
                "        }\n" +
                "    ],\n" +
                "    \"tteoksangStatistics\": {\n" +
                "        \"values\": [\n" +
                "            {\n" +
                "                \"productId\": 3,\n" +
                "                \"value\": 11.7\n" +
                "            },\n" +
                "            {\n" +
                "                \"productId\": 7,\n" +
                "                \"value\": 11.5\n" +
                "            },\n" +
                "            {\n" +
                "                \"productId\": 5,\n" +
                "                \"value\": 10.2\n" +
                "            }\n" +
                "        ]\n" +
                "    },\n" +
                "    \"tteokrockStatistics\": {\n" +
                "        \"values\": [\n" +
                "            {\n" +
                "                \"productId\": 3,\n" +
                "                \"value\": -21\n" +
                "            },\n" +
                "            {\n" +
                "                \"productId\": 1,\n" +
                "                \"value\": -18\n" +
                "            },\n" +
                "            {\n" +
                "                \"productId\": 6,\n" +
                "                \"value\": -15\n" +
                "            }\n" +
                "        ]\n" +
                "    },\n" +
                "    \"bestSellerStatistics\": {\n" +
                "        \"values\": [\n" +
                "            {\n" +
                "                \"productId\": 3,\n" +
                "                \"value\": 23000000\n" +
                "            },\n" +
                "            {\n" +
                "                \"productId\": 7,\n" +
                "                \"value\": 11000000\n" +
                "            },\n" +
                "            {\n" +
                "                \"productId\": 1,\n" +
                "                \"value\": 5000000\n" +
                "            }\n" +
                "        ]\n" +
                "    }\n" +
                "}\n";
        ObjectMapper mapper = new ObjectMapper();
        boolean isSuccess = false;
        Quarter message = null;
        try {
            message = mapper.readValue(logData, Quarter.class);
            isSuccess = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        GameMessageRes quarterResult = GameMessageRes.builder()
                .type(MessageType.OFFLINE_REPORT)
                .isSuccess(isSuccess)
                .body(message)
                .build();

        simpMessagingTemplate.convertAndSend("/topic/private/" + webSocketId, quarterResult);
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
