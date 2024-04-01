package com.welcome.tteoksang.game.dto.log;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisconnectLogInfo {
    private Integer seasonId;
    private Integer gameId;
    private String userId;
    private Integer playTime;
}
