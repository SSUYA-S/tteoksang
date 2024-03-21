package com.welcome.tteoksang.socket.interceptor;

import com.welcome.tteoksang.auth.exception.TokenInvalidException;
import com.welcome.tteoksang.auth.jwt.JWTUtil;
import com.welcome.tteoksang.game.dto.RedisGameInfo;
import com.welcome.tteoksang.game.exception.WebSocketIdNotExistException;
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
import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;

@RequiredArgsConstructor
@Component
@Slf4j
public class JwtTokenChannelInterceptor implements ChannelInterceptor {

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
        // CONNECT요청 처리
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Authorization 헤더 확인
            String authToken = accessor.getFirstNativeHeader("Authorization");

            if (authToken != null && authToken.startsWith("Bearer ")) {
                String jwtToken = authToken.split(" ")[1];
                try {
                    // 토큰 유효성 검사
                    if (!jwtUtil.isValid(jwtToken)) {
                        throw new JwtException("토큰이 만료되었습니다.");
                    }
                    //토큰에서 userId, role 획득
                    String userId = jwtUtil.getUserId(jwtToken);

                    //user를 생성하여 값 set
                    User user = userRepository.findByUserIdAndDeletedAtIsNull(userId).orElseThrow(() -> new JwtException("올바르지 않은 토큰입니다."));

                    //스프링 시큐리티 인증 토큰 생성
                    Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, null);

                    // 사용자 정보 저장
                    accessor.setUser(authentication);

                    String webSocketKey = RedisPrefix.WEBSOCKET.prefix() + user.getUserId();

                    // 레디스에서 webSocketId가 있는지 확인
                    String webSocketId = redisService.hasKey(webSocketKey) ? (String) redisService.getValues(webSocketKey) : null;

//                    if (webSocketId == null)
//                        throw new WebSocketIdNotExistException();

                    // gameInfo 불러오기
                    GameInfo gameInfo = gameInfoService.searchGameInfo(userId);
                    Map<Integer, Integer> products;

                    if (gameInfo != null) {
                        String gameInfoKey = RedisPrefix.INGAMEINFO.prefix() + user.getUserId();

//                        try (ByteArrayInputStream byteStream = new ByteArrayInputStream(gameInfo.getProducts());
//                             ObjectInputStream objStream = new ObjectInputStream(byteStream)) {
//
//                            Object productsObject = objStream.readObject();
//                            if (productsObject instanceof Map) {
//                                products = (Map<Integer, Integer>) productsObject;
//                            } else {
//                                throw new IllegalArgumentException("역직렬화된 객체가 Map이 아닙니다.");
//                            }
//                        } catch (Exception e) {
//                            throw new RuntimeException("역직렬화 과정에서 오류 발생", e);
//                        }

                        // 게임 데이터 불러오기 확인
                        log.info("[JWTTokenChannelInterceptor] - inGameInfo : {}, {}, {}, {}"
                                , gameInfo.getGameId(), gameInfo.getGold(),
                                gameInfo.getWarehouseLevel(), gameInfo.getVehicleLevel()
                        );

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
                                .rentFee(gameInfo.getRentFee())
                                .build();

//                        inGameInfo.put("gameId", gameInfo.getGameId());
//                        inGameInfo.put("gold", gameInfo.getGold());
//                        inGameInfo.put("warehouseLevel", gameInfo.getWarehouseLevel());
//                        inGameInfo.put("vehicleLevel", gameInfo.getVehicleLevel());
//                        inGameInfo.put("brokerLevel", gameInfo.getBrokerLevel());
//                        inGameInfo.put("privateEventId", gameInfo.getPrivateEventId());
//                        inGameInfo.put("lastPlayTurn", gameInfo.getLastPlayTurn());
//                        inGameInfo.put("lastConnectTime", gameInfo.getLastConnectTime());
//                        inGameInfo.put("purchaseQuantity", gameInfo.getPurchaseQuantity());
//                        inGameInfo.put("products", products);
//                        inGameInfo.put("rentFee", gameInfo.getRentFee());

//                        redisService.setValues(gameInfoKey, inGameInfo);
//                        log.info("{}",redisService.getValues(gameInfoKey).toString());
                    }

                } catch (JwtException e) {
                    throw new TokenInvalidException(e);
                }
            }
        }
        return message;
    }
}
