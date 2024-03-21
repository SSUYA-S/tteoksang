package com.welcome.tteoksang.socket.interceptor;

import com.welcome.tteoksang.auth.jwt.JWTUtil;
import com.welcome.tteoksang.game.dto.RedisGameInfo;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.user.dto.GameInfo;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.repository.UserRepository;
import com.welcome.tteoksang.user.service.GameInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.util.Map;

@RequiredArgsConstructor
@Component
@Slf4j
public class InGameChannelInterceptor implements ChannelInterceptor {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final RedisService redisService;
    private final GameInfoService gameInfoService;

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
        // 핸드쉐이크에서 등록한 유저 정보 가져오기
        String userId = null;
        if (accessor != null) {
            // simpSessionAttributes에서 userId 속성 가져오기
            Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
            if (sessionAttributes != null) {
                userId = (String) sessionAttributes.get("userId");
            }
        }

        // CONNECT요청 처리
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            //user를 생성하여 값 set
            User user = userRepository.findByUserIdAndDeletedAtIsNull(userId).orElseThrow(() -> new JwtException("올바르지 않은 토큰입니다."));
            log.debug("유저 아이디 :{}", userId);

            //스프링 시큐리티 인증 토큰 생성
            Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, null);

            // 사용자 정보 저장
            accessor.setUser(authentication);

            // 메시지의 목적지(destination)을 가져와 private시 webSocketId가 유효성 검사 실시
            String destination = accessor.getDestination();

            // 목적지가 "/private/"으로 시작하는 경우의 websocketId 확인
            if (destination != null && destination.startsWith("/private/")) {

                // WebSocket ID 추출
                String webSocketId = destination.substring("/private/".length());

                // Redis에서 webSocketId의 유효성 검증
                String webSocketKey = RedisPrefix.WEBSOCKET.prefix() + user.getUserId();

                // 레디스에서 webSocketId가 있는지 확인
                if (!redisService.hasKey(webSocketKey)) {
                    log.debug("webSocketId 없음");
                    // 에러 처리
                }
                if (!webSocketId.equals(redisService.getValues(webSocketKey))) {
                    log.debug("다른 토픽을 구독함");
                }
                // gameInfo 불러오기
                GameInfo gameInfo = gameInfoService.searchGameInfo(userId);
//                Map<Integer, Integer> products;

                if (gameInfo != null) {
                    String gameInfoKey = RedisPrefix.INGAMEINFO.prefix() + user.getUserId();
//                    // 농산물 데이터 역직렬화
//                    try (ByteArrayInputStream byteStream = new ByteArrayInputStream(gameInfo.getProducts());
//                         ObjectInputStream objStream = new ObjectInputStream(byteStream)) {
//
//                        Object productsObject = objStream.readObject();
//                        if (productsObject instanceof Map) {
//                            products = (Map<Integer, Integer>) productsObject;
//                        } else {
//                            throw new IllegalArgumentException("역직렬화된 객체가 Map이 아닙니다.");
//                        }
//                    } catch (Exception e) {
//                        throw new RuntimeException("역직렬화 과정에서 오류 발생", e);
//                    }

                    // 게임 데이터 불러오기 위한 정보 확인
                    log.info("[JWTTokenChannelInterceptor] - inGameInfo : {}, {}, {}, {}"
                            , gameInfo.getGameId(), gameInfo.getGold(),
                            gameInfo.getWarehouseLevel(), gameInfo.getVehicleLevel()
                    );

                    // 레디스에 게임 데이터 저장
                    RedisGameInfo inGameInfo = RedisGameInfo.builder()
                            .gameId(gameInfo.getGameId())
                            .gold(gameInfo.getGold())
                            .warehouseLevel(gameInfo.getWarehouseLevel())
                            .vehicleLevel(gameInfo.getVehicleLevel())
                            .brokerLevel(gameInfo.getBrokerLevel())
                            .privateEventId(gameInfo.getPrivateEventId())
                            .lastPlayTurn(gameInfo.getLastPlayTurn())
                            .lastConnectTime(gameInfo.getLastConnectTime())
                            .purchaseQuantity(gameInfo.getPurchaseQuantity())
                            .products(null)//(products)
//                            .products(products)
                            .rentFee(gameInfo.getRentFee())
                            .build();

                    log.info("인게임 정보:{}", inGameInfo.getGold());
                    redisService.setValues(gameInfoKey, inGameInfo);
                }
            }
        }
        return message;
    }
}
