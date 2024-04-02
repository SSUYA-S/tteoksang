package com.welcome.tteoksang.game.dto.result.end;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicProductReportInfo {
    private Integer productId;
    private Integer totalAccProductPurchaseQuantity;
    private Long totalAccProductOutcome;
    private Integer totalAccProductSalesQuantity;
    private Long totalAccProductIncome;
    private Long totalAccProductProfit;
    private Long totalAccBrokerFee;
    private Integer maxProductPurchaseQuantityPerTurn;
    private Integer maxProductSalesQuantityPerTurn;
}
