package com.welcome.tteoksang.game.dto.result;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductStatistic {
    private Integer accPrivateProductSalesQuantity;
    private Integer accPrivateProductPurchaseQuantity;
    private Long accPrivateProductIncome;
    private Long accPrivateProductOutcome;
    private Long accPrivateProductProfit;
    private Long accPrivateBrokerFee;
    private Integer maxPrivateProductSalesQuantity;
    private Integer maxPrivateProductPurchaseQuantity;
    private Long maxPrivateProductProfit;
    private Integer maxPrivateProductHoldingQuantity;
    private Long maxPrivateProductSalesCost;
    private Long maxPrivateProductPurchaseCost;
    private Integer minPrivateProductSalesCost;
    private Integer minPrivateProductPurchaseCost;
}
