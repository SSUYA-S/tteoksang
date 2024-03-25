package com.welcome.tteoksang.user.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo {
    private String nickname;

    private Integer profileIconId;

    private Integer profileFrameId;

    private Integer themeId;

    private Integer titleId;
}
