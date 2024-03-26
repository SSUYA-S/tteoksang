package com.welcome.tteoksang.auth.jwt;

import com.welcome.tteoksang.auth.cookie.CookieUtil;
import com.welcome.tteoksang.auth.dto.TokenCookie;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.exception.UserNotExistException;
import com.welcome.tteoksang.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * 기존에 로그인 했던 사용자 판별 및 토큰 유효성 검사 실시
 * OAuth 로그인 전 확인 필터
 */
@Slf4j
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final RedisService redisService;
    private final UserRepository userRepository;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

//        // Authorization 헤더 확인
//        String authorization = request.getHeader("Authorization");
//
//        // Authorization 헤더 검증
//        if (authorization == null || !authorization.startsWith("Bearer ")) {
//            // 인증이 필요없는 요청들을 위해 계속 진행 - 로그인 상태 x, 로그인 시도
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        // 토큰 파싱
//        String token = authorization.split(" ")[1];

//        // 유효성 검사
//        if (!jwtUtil.isValid(token)) {
//            response.setStatus(401);
//        } else {
//            String userId = jwtUtil.getUserId(token);
//
//            //user를 생성하여 값 set
//            User user;
//            try {
//                //DB에서 유저 정보 탐색
//                user = userRepository.findByUserId(userId).orElseThrow(UserNotExistException::new);
//                //스프링 시큐리티 인증 토큰 생성 - 우리가 사용할 내용은 유저 객체
//                Authentication authToken = new UsernamePasswordAuthenticationToken(user, null, null);
//
//                //세션에 사용자 등록
//                SecurityContextHolder.getContext().setAuthentication(authToken);
//
//                filterChain.doFilter(request, response);
//            } catch (Exception e) {
//                response.setStatus(401);
//            }
//        }

        log.debug("----------------JWT 필터 타기 -----------------");
        log.debug("[JWTFilter] - 필터 시작");

        // Cookie 기반 토큰 확인
        TokenCookie tokenCookie = CookieUtil.resolveToken(request);
        Cookie accessTokenCookie = tokenCookie.getAccessTokenCookie();
        Cookie refreshTokenCookie = tokenCookie.getRefreshTokenCookie();

        // Cookie 검증
        if (refreshTokenCookie == null) {
            // 남아있는 쿠키 제거
            if (accessTokenCookie != null) {
                CookieUtil.deleteCookie(accessTokenCookie, response);
            }

            // 401 - 에러 발생
            filterChain.doFilter(request, response);
            return;
        }

        // Refresh 토큰 파싱
        String refreshToken = refreshTokenCookie.getValue();

        // 유효성 검사 - Refresh 토큰
        if (!jwtUtil.isValid(refreshToken)) {
            // Access 토큰 제거
            if(accessTokenCookie != null) {
                CookieUtil.deleteCookie(accessTokenCookie, response);
            }
            // 레디스에서 Refresh 토큰 제거, Refresh 토큰 제거
            redisService.deleteValues(refreshToken);
            CookieUtil.deleteCookie(refreshTokenCookie, response);

            // 401 에러 발생
            filterChain.doFilter(request, response);
        } else {
            String userId = jwtUtil.getUserId(refreshToken);
            log.debug("토큰 유저:{}", userId);

            if (accessTokenCookie == null || !jwtUtil.isValid(accessTokenCookie.getValue())) {
                // 유효하지 않은 경우 기존 쿠키 삭제 (accessTokenCookie가 null이 아닐 때만 해당)
                if (accessTokenCookie != null) {
                    CookieUtil.deleteCookie(accessTokenCookie, response);
                }

                // 새로운 accessToken 생성 및 쿠키에 추가
                String newAccessToken = jwtUtil.createJwt(userId, 1000 * 60 * 60L); // 1시간 유효기간
                Cookie newCookie = new Cookie("accessToken", newAccessToken);
                newCookie.setPath("/");
                response.addCookie(newCookie);

                accessTokenCookie = newCookie; // 새로운 쿠키로 업데이트
            }

            //user를 생성하여 값 set
            User user;
            try {
                //DB에서 유저 정보 탐색
                user = userRepository.findByUserIdAndDeletedAtIsNull(userId).orElseThrow(UserNotExistException::new);
                //스프링 시큐리티 인증 토큰 생성 - 우리가 사용할 내용은 유저 객체
                Authentication authToken = new UsernamePasswordAuthenticationToken(user, null, null);

                //세션에 사용자 등록
                SecurityContextHolder.getContext().setAuthentication(authToken);

                filterChain.doFilter(request, response);
            } catch (Exception e) {
                // 레디스에서 해당 쿠키 제거
                redisService.deleteValues(refreshToken);

                // 토큰 쿠키 제거
                CookieUtil.deleteCookie(accessTokenCookie, response);
                CookieUtil.deleteCookie(refreshTokenCookie, response);

                // 오류 발생
                response.setStatus(401);
            }
        }
    }
}