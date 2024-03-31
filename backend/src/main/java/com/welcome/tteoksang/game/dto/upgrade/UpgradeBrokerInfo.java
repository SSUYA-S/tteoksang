package com.welcome.tteoksang.game.dto.upgrade;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpgradeBrokerInfo {
    private Long gold;
    private Integer brokerLevel;
}
