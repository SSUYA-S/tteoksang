package com.welcome.tteoksang.game.dto.result.end;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrivateProductReportInfo {
    private Integer productId;
    private Integer totalAccPrivateProductPurchaseQuantity;
    private Long totalAccPrivateProductOutcome;
    private Integer totalAccPrivateProductSalesQuantity;
    private Long totalAccPrivateProductIncome;
    private Long totalAccPrivateProductProfit;
    private Long totalAccPrivateBrokerFee;
}
