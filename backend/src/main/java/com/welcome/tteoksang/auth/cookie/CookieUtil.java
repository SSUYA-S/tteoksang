package com.welcome.tteoksang.auth.cookie;

import com.welcome.tteoksang.auth.dto.TokenCookie;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

/**
 * 쿠키 정보 가져오기
 */
public class CookieUtil {
    public static TokenCookie resolveToken(HttpServletRequest request) {
        Cookie accessTokenCookie = null, refreshTokenCookie = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    accessTokenCookie = cookie;
                } else if ("refreshToken".equals(cookie.getName())) {
                    refreshTokenCookie = cookie;
                }
            }
        }
        return TokenCookie.builder()
                .accessTokenCookie(accessTokenCookie)
                .refreshTokenCookie(refreshTokenCookie)
                .build();
    }
}
