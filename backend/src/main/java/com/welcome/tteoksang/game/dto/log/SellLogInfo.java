package com.welcome.tteoksang.game.dto.log;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellLogInfo {
    private Integer seasonId;
    private String userId;
    private Integer gameId;
    private Integer turn;
    private Integer productId;
    private Long productIncome;
    private Integer soldQuantity;
    private Integer brokerFee;
    private Long productProfit;
    private Integer productCost;
}
