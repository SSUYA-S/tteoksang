package com.welcome.tteoksang.game.dto.log;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpgradeLogInfo {
    private Integer seasonId;
    private String userId;
    private Integer gameId;
    private Integer turn;
    private Integer upgradeFee;
}
