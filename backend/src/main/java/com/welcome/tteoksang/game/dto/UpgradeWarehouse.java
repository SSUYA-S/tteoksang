package com.welcome.tteoksang.game.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpgradeWarehouse {
    private Long gold;
    private Integer warehouseLevel;
}
