package com.welcome.tteoksang.game.dto;

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
