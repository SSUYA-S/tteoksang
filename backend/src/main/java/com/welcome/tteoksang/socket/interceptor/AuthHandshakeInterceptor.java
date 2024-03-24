package com.welcome.tteoksang.socket.interceptor;

import com.welcome.tteoksang.auth.cookie.CookieUtil;
import com.welcome.tteoksang.auth.dto.TokenCookie;
import com.welcome.tteoksang.auth.jwt.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@RequiredArgsConstructor
@Component
@Slf4j
public class AuthHandshakeInterceptor implements HandshakeInterceptor {

    private final JWTUtil jwtUtil;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
        HttpServletRequest httpServletRequest = servletRequest.getServletRequest();

        // 토큰 검증 로직
        TokenCookie authToken = CookieUtil.resolveToken(httpServletRequest);
        Cookie accessTokenCookie = authToken.getAccessTokenCookie();
        if (accessTokenCookie == null || !jwtUtil.isValid(accessTokenCookie.getValue())) {
            // 토큰이 유효하지 않은 경우 여기서는 HTTP 응답으로 에러 메시지를 직접 설정할 수 없으므로, 연결을 거부하기 위해 false 반환
            return false;
        }
        String userId = jwtUtil.getUserId(accessTokenCookie.getValue());

        // 검증 성공 시 유저 Id 저장
        attributes.put("userId", userId);
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        // 핸드셰이크 후 처리
    }
}