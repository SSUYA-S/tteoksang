package com.welcome.tteoksang.socket.interceptor;

import com.welcome.tteoksang.auth.exception.TokenInvalidException;
import com.welcome.tteoksang.auth.jwt.JWTUtil;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

@RequiredArgsConstructor
@Component
public class JwtTokenChannelInterceptor implements ChannelInterceptor {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    /**
     * 메시지를 보내기 전에 실행되는 인터셉터 메소드
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
                    if (jwtUtil.isValid(jwtToken)) {
                        throw new JwtException("토큰이 만료되었습니다.");
                    }
                    //토큰에서 userId, role 획득
                    String userId = jwtUtil.getUserId(jwtToken);

                    //user를 생성하여 값 set
                    User user = userRepository.findByUserIdAndDeletedAtIsNull(userId).orElseThrow(()-> new JwtException("올바르지 않은 토큰입니다."));

                    //스프링 시큐리티 인증 토큰 생성
                    Authentication authentication = new UsernamePasswordAuthenticationToken(user, null);
                    authentication.setAuthenticated(true);

                    // 사용자 정보 저장
                    accessor.setUser(authentication);
                } catch (JwtException e) {
                    throw new TokenInvalidException(e);
                }
            }
        }

        return message;
    }
}
