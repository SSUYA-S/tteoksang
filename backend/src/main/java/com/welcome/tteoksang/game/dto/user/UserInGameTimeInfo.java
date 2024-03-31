package com.welcome.tteoksang.game.dto.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInGameTimeInfo {
    private String inGameTime;
    private String turnStartTime;
    private Integer turn;
}
