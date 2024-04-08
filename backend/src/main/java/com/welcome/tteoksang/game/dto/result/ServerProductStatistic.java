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
    private Long accProductSalesQuantity = 0L;

    @Field("accProductPurchaseQuantity")
    private Long accProductPurchaseQuantity = 0L;

    @Field("accProductIncome")
    private Long accProductIncome = 0L;

    @Field("accProductOutcome")
    private Long accProductOutcome = 0L;

    @Field("accProductProfit")
    private Long accProductProfit = 0L;

    @Field("accProductBrokerFee")
    private Long accProductBrokerFee = 0L;

    @Field("maxProductSalesQuantity")
    private Integer maxProductSalesQuantity = 0;

    @Field("maxProductPurchaseQuantity")
    private Integer maxProductPurchaseQuantity = 0;

    @Field("maxProductProfit")
    private Long maxProductProfit = 0L;

    @Field("maxProductHoldingQuantity")
    private Integer maxProductHoldingQuantity = 0;

    @Field("maxProductSalesCost")
    private Long maxProductSalesCost = 0L;

    @Field("maxProductPurchaseCost")
    private Long maxProductPurchaseCost = 0L;

    @Field("minProductSalesCost")
    private Long minProductSalesCost = 0L;

    @Field("minProductPurchaseCost")
    private Long minProductPurchaseCost = 0L;
}
