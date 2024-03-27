package com.welcome.tteoksang.game.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpgradeWarehouseInfo {
    private Long gold;
    private Integer warehouseLevel;
}
