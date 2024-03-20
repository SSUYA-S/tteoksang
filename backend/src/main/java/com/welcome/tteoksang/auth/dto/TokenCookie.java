package com.welcome.tteoksang.auth.dto;

import jakarta.servlet.http.Cookie;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenCookie {
    private Cookie accessTokenCookie;
    private Cookie refreshTokenCookie;
}
