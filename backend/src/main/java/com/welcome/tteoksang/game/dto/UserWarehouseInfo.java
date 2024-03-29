package com.welcome.tteoksang.game.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserWarehouseInfo {
    private Integer warehouseLevel;
    private Integer vehicleLevel;
    private Integer brokerLevel;
    private Map<Integer, UserProductInfo> products; // 유저가 가지고 있는 농산물 정보
}
