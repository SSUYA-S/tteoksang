package com.welcome.tteoksang.game.scheduler.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RedisProductInfo {
    Integer productId;
    Long productCost;
    Integer productMaxQuantity;
    Long productFluctuation;
    Double productAvgCost;
}
