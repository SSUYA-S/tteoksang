package com.welcome.tteoksang.game.dto.result;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServerProductStatistic {
    @Field("accProductSalesQuantity")
    private Long accProductSalesQuantity;

    @Field("accProductPurchaseQuantity")
    private Long accProductPurchaseQuantity;

    @Field("accProductIncome")
    private Long accProductIncome;

    @Field("accProductOutcome")
    private Long accProductOutcome;

    @Field("accProductProfit")
    private Long accProductProfit;

    @Field("accProductBrokerFee")
    private Long accProductBrokerFee;

    @Field("maxProductSalesQuantity")
    private Integer maxProductSalesQuantity;

    @Field("maxProductPurchaseQuantity")
    private Integer maxProductPurchaseQuantity;

    @Field("maxProductProfit")
    private Long maxProductProfit;

    @Field("maxProductHoldingQuantity")
    private Integer maxProductHoldingQuantity;

    @Field("maxProductSalesCost")
    private Long maxProductSalesCost;

    @Field("maxProductPurchaseCost")
    private Long maxProductPurchaseCost;

    @Field("minProductSalesCost")
    private Long minProductSalesCost;

    @Field("minProductPurchaseCost")
    private Long minProductPurchaseCost;
}
