package com.welcome.tteoksang.game.dto.log;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConnectLogInfo {
    private Integer seasonId;
    private Integer gameId;
    private String userId;
    private Integer onlineTimeSlot;
}
