package com.welcome.tteoksang.game.dto.log;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyLogInfo {
    private Integer seasonId;
    private String userId;
    private Integer gameId;
    private Integer turn;
    private Integer productId;
    private Integer purchasedQuantity;
    private Long productOutcome;
    private Integer productQuantity;
    private Integer productCost;
}
