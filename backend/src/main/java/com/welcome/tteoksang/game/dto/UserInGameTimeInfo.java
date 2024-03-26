package com.welcome.tteoksang.game.dto;

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
