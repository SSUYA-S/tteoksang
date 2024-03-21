package com.welcome.tteoksang.auth.cookie;

import com.welcome.tteoksang.auth.dto.TokenCookie;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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

//    public static Cookie searchCookie(String cookieName, HttpServletRequest request) {
//        Cookie selectedCookie = null;
//        Cookie[] cookies = request.getCookies();
//        if (cookies != null) {
//            for (Cookie cookie : cookies) {
//                if (cookieName.equals(cookie.getName())) {
//                    selectedCookie = cookie;
//                }
//            }
//        }
//        return selectedCookie;
//    }

    public static void deleteTokenCookie(HttpServletRequest request,
                                         HttpServletResponse response) {
        TokenCookie tokenCookie = CookieUtil.resolveToken(request);

        Cookie accessTokenCookie = tokenCookie.getAccessTokenCookie();
        Cookie refreshTokenCookie = tokenCookie.getRefreshTokenCookie();

        // 해당 쿠키 제거
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(0);
        response.addCookie(accessTokenCookie);

        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);
    }
}
