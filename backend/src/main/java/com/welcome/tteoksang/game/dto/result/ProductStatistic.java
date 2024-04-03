package com.welcome.tteoksang.game.dto.result;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductStatistic {
    @Field("accPrivateProductSalesQuantity")
    private Integer accPrivateProductSalesQuantity;

    @Field("accPrivateProductPurchaseQuantity")
    private Integer accPrivateProductPurchaseQuantity;

    @Field("accPrivateProductIncome")
    private Long accPrivateProductIncome;

    @Field("accPrivateProductOutcome")
    private Long accPrivateProductOutcome;

    @Field("accPrivateProductProfit")
    private Long accPrivateProductProfit;

    @Field("accPrivateBrokerFee")
    private Long accPrivateBrokerFee;

    @Field("maxPrivateProductSalesQuantity")
    private Integer maxPrivateProductSalesQuantity;

    @Field("maxPrivateProductPurchaseQuantity")
    private Integer maxPrivateProductPurchaseQuantity;

    @Field("maxPrivateProductProfit")
    private Long maxPrivateProductProfit;

    @Field("maxPrivateProductHoldingQuantity")
    private Integer maxPrivateProductHoldingQuantity;

    @Field("maxPrivateProductSalesCost")
    private Long maxPrivateProductSalesCost;

    @Field("maxPrivateProductPurchaseCost")
    private Long maxPrivateProductPurchaseCost;

    @Field("minPrivateProductSalesCost")
    private Integer minPrivateProductSalesCost;

    @Field("minPrivateProductPurchaseCost")
    private Integer minPrivateProductPurchaseCost;
}
