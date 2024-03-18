package com.welcome.tteoksang.auth.jwt;

import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.exception.UserNotExistException;
import com.welcome.tteoksang.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * 기존에 로그인 했던 사용자인지 판별 및 토큰 유효성 검사 실시
 */

@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

  private final JWTUtil jwtUtil;
  private final UserRepository userRepository;


  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    // Authorization 헤더 확인
    String authorization = request.getHeader("Authorization");

    // Authorization 헤더 검증
    if (authorization == null || !authorization.startsWith("Bearer ")) {
      // 인증이 필요없는 요청들을 위해 계속 진행 - 로그인 상태 x, 로그인 시도
      filterChain.doFilter(request, response);
      return;
    }

    // 토큰 파싱
    String token = authorization.split(" ")[1];

    // 유효성 검사
    if (!jwtUtil.isValid(token)) {
      response.setStatus(401);
    } else {
      String userId = jwtUtil.getUserId(token);

      //user를 생성하여 값 set
      User user;
      try {
        //DB에서 유저 정보 탐색
        user = userRepository.findByUserId(userId).orElseThrow(UserNotExistException::new);
        //스프링 시큐리티 인증 토큰 생성 - 우리가 사용할 내용은 유저 객체
        Authentication authToken = new UsernamePasswordAuthenticationToken(user, null, null);

        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
      } catch (Exception e) {
        response.setStatus(401);
      }
    }
  }
}