package com.welcome.tteoksang.game.dto.result.half;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheFirstUserInfo {
    private String userNickname;
    private Integer profileIconId;
    private Integer profileFrameId;
}
