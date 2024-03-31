package com.welcome.tteoksang.socket.interceptor;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.auth.exception.TokenInvalidException;
import com.welcome.tteoksang.auth.jwt.JWTUtil;
import com.welcome.tteoksang.game.dto.log.ConnectLogInfo;
import com.welcome.tteoksang.game.dto.log.DisconnectLogInfo;
import com.welcome.tteoksang.game.dto.log.LogMessage;
import com.welcome.tteoksang.game.dto.user.RedisGameInfo;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
import com.welcome.tteoksang.game.service.RedisGameInfoService;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.socket.exception.SubscribeDupulicateException;
import com.welcome.tteoksang.socket.exception.UserNotExistInSessionException;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.exception.UserNotExistException;
import com.welcome.tteoksang.user.repository.UserRepository;
import com.welcome.tteoksang.user.service.GameInfoService;
import com.welcome.tteoksang.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RequiredArgsConstructor
@Component
@Slf4j
public class InGameChannelInterceptor implements ChannelInterceptor {

    private final JWTUtil jwtUtil;
    private final UserService userService;
    private final UserRepository userRepository;
    private final RedisService redisService;
    private final RedisGameInfoService redisGameInfoService;
    private final GameInfoService gameInfoService;
    private final ServerInfo serverInfo;

    private final Set<String> subscribedTopics = new HashSet<>();

    /**
     * 메시지를 보내기 전에 실행되는 인터셉터 메소드
     *
     * @param message 전송될 메시지. 이 메시지의 헤더에는 JWT 토큰이 포함되어 있어야 함
     * @param channel 메시지가 전송될 채널
     * @return 수정된 메시지를 반환(사용자 인증 정보가 추가된 메시지)
     */

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null) {
            String userId = extractAndValidateUserId(accessor);
            if (userId == null) {
                // 유저 ID가 없거나 검증에 실패한 경우, 메시지 처리를 중단할 수 있습니다.
                log.error("[InGameChannelInterceptor] - error: 유저가 없습니다.");
                return null;
            }
            try {
                switch (accessor.getCommand()) {
                    case CONNECT:
                        handleConnect(userId);
                        break;
                    case DISCONNECT:
                        handleDisconnect(userId, accessor);
                        break;
                    case SUBSCRIBE:
                        handleSubscribe(userId, accessor);
                        break;
                }
            } catch (Exception e) {
                log.error("[InGameChannelInterceptor] - error : {}", e.getMessage());
                return null;
            }
        }
        log.debug("[InGameChannelInterceptor] - {} MESSAGE END", accessor.getCommand());
        return message;
    }

    private String extractAndValidateUserId(StompHeaderAccessor accessor) {
        String userId = null;
        // 핸드 셰이크에서 등록한 유저 정보 가져오기 -> simpSessionAttributes에서 userId 속성 가져오기
        Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
        if (sessionAttributes != null && sessionAttributes.get("userId") == null) {
            /*
                웹에서 ws 테스트 시 유저 정보가 없기 때문에 자체적으로 Authorization Bearer로 설정해서 확인한다.
            */
            String authToken = accessor.getFirstNativeHeader("Authorization");

            if (authToken != null && authToken.startsWith("Bearer ")) {
                String jwtToken = authToken.split(" ")[1];
                // 토큰 유효성 검사
                if (!jwtUtil.isValid(jwtToken)) {
                    throw new JwtException("토큰이 유효하지 않습니다.");
                }
                try {
                    //토큰에서 userId, role 획득
                    userId = jwtUtil.getUserId(jwtToken);
                    sessionAttributes.put("userId", userId);
                    log.debug("[InGameChannelInterceptor] - 헤더 유저 아이디 : {}", userId);
                } catch (TokenInvalidException e) {
                    throw new TokenInvalidException();
                }
            }
        }
        // 핸드 셰이크에 정보가 있는 경우 그대로 사용
        else {
            userId = (String) sessionAttributes.get("userId");
            log.debug("[InGameChannelInterceptor] - 핸드 셰이크 유저 아이디: {}", userId);
        }
        return userId;
    }

    // CONNECT 처리 로직
    private void handleConnect(String userId) {
        log.debug("[InGameChannelInterceptor] - CONNECT MESSAGE START");
//        log.debug("{\n" +
//                "    \"type\": \"BUY\",\n" +
//                "    \"body\": {\n" +
//                "        \"userId\" : \"asdffw-qwerqw\",\n" +
//                "        \"gameId\": 1,\n" +
//                "        \"turn\": 12,\n" +
//                "        \"productId\": 8,\n" +
//                "        \"purchasedQuantity\": 12,\n" +
//                "        \"productOutcome\": 123,\n" +
//                "        \"productQuantity\": 11,\n" +
//                "        \"productCost\": 130\n" +
//                "    }\n" +
//                "}");

        //user를 생성하여 값 set
        User user = userRepository.findByUserIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new UserNotExistException("해당하는 유저가 없습니다."));

        // 레디스에 유저 정보 저장
        userService.saveUserInfo(user);
        // DB에 있는 게임 데이터 불러오기
        gameInfoService.loadGameInfo(user.getUserId());
    }

    // DISCONNECT 처리 로직
    private void handleDisconnect(String userId, StompHeaderAccessor accessor) throws UserNotExistInSessionException {
        log.debug("[InGameChannelInterceptor] - DISCONNECT MESSAGE START");

        String gameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        RedisGameInfo redisGameInfo = (RedisGameInfo) redisService.getValues(gameInfoKey);
        if (redisGameInfo != null) {
            int time = (int) Duration.between(redisGameInfo.getLastConnectTime(), LocalDateTime.now()).toMinutes();
            DisconnectLogInfo logInfo = DisconnectLogInfo.builder()
                    .seasonId(serverInfo.getSeasonId())
                    .userId(userId)
                    .playTime(time)
                    .build();

            LogMessage logMessage = LogMessage.builder()
                    .type("DISCONNECT")
                    .body(logInfo)
                    .build();
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                String logData = objectMapper.writeValueAsString(logMessage);
                log.debug(logData);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }

        // 레디스에 있는 게임 데이터 저장
        redisGameInfoService.saveRedisGameInfo(userId);


        // 레디스에 있는 유저 정보 지우기
        String userInfoKey = RedisPrefix.USERINFO.prefix() + userId;
        if (redisService.hasKey(userInfoKey)) {
            redisService.deleteValues(userInfoKey);
            log.debug("[InGameChannelInterceptor] - DISCONNECT: 유저 정보 제거");
        }

        // 세션에서 지우기
        accessor.getSessionAttributes().remove("userId");
        log.debug("[InGameChannelInterceptor] - DISCONNECT: 세션 내 유저 정보 지우기");

        // 구독 정보 지우기
        subscribedTopics.clear();

        String destination = accessor.getDestination();
        log.debug("[InGameChannelInterceptor] - DISCONNECT, 현재 구독 중인 개인 토픽 : {}", accessor.getDestination());
        if (destination != null && destination.startsWith("/topic/private/")) {
            // WebSocket ID 추출
            String webSocketId = destination.substring("/topic/private/".length());

            // 레디스에서 webSocketId가 있는지 확인
            if (!redisService.hasKey(webSocketId)) {
                log.debug("[InGameChannelInterceptor] - DISCONNECT: webSocketId 없음");
                // 에러 처리
            }
            // 레디스에 있는 WebSocketId 지우기
            redisService.deleteValues(webSocketId);
        }
    }

    // SUBSCRIBE 처리 로직
    private void handleSubscribe(String userId, StompHeaderAccessor accessor) throws SubscribeDupulicateException {
        // 메시지의 목적지(destination)을 가져와 private시 webSocketId가 유효성 검사 실시
        String destination = accessor.getDestination();
        log.debug("[InGameChannelInterceptor] - SUBSCRIBE, 구독 : {}", accessor.getDestination());
        if (destination != null && destination.startsWith("/topic/private/")) {
            // WebSocket ID 추출
            String webSocketId = destination.substring("/topic/private/".length());

            // Redis에서 webSocketId의 유효성 검증
            String webSocketKey = RedisPrefix.WEBSOCKET.prefix() + userId;

            // 레디스에서 webSocketId가 있는지 확인
            if (!redisService.hasKey(webSocketKey)) {
                log.error("[InGameChannelInterceptor] - SUBSCRIBE: webSocketId 없음");
                // 에러 처리
            }
            // 클라이언트가 이미 해당 토픽을 구독한 경우에는 처리하지 않음
            if (subscribedTopics.contains(webSocketId)) {
                // 중복 구독 처리 또는 에러 처리
                log.debug("[InGameChannelInterceptor] - SUBSCRIBE: 이미 구독된 토픽입니다.");
//                throw new SubscribeDupulicateException("이미 구독된 토픽입니다.");
            }
            // 구독 상태 갱신
            subscribedTopics.add(webSocketId);
        }
    }
}
