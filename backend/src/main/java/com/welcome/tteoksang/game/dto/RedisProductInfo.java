package com.welcome.tteoksang.game.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RedisProductInfo {
    Integer productId;
    Integer productCost;
    Integer productMaxQuantity;
    Integer productFluctuation;
    Double productAvgCost;
}
