package com.welcome;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductInfo {
    private Long accPrivateProductPurchaseQuantity; // 품목별 누적 구매 수량
    private Long maxPrivateProductPurchaseQuantity; // 품목별 개인 최대 품목 구매 수량
    private Long accPrivateProductOutcome;  // 품목별 누적 구매 비용
    private Long accPrivateProductSalesQuantity;    // 품목별 누적 판매 수량
    private Long maxPrivateProductSalesQuantity; // 품목별 최대 판매 수량
    private Long accPrivateProductIncome;   // 품목별 누적 판매 비용
    private Long accPrivateProductProfit;   // 품목별 누적 판매 순이익
    private Long maxPrivateProductProfit;   // 품목별 최대 판매 순이익
    private Long maxPrivateProductHoldingQuantity;  // 품목별 최대 보유량
    private Long maxPrivateProductPurchaseCost; // 품목별 구매시 최고 단가
    private Long minPrivateProductPurchaseCost; // 품목별 구매시 최저 단가
    private Long maxPrivateProductSalesCost;    // 품목별 판매시 최고 단가
    private Long minPrivateProductSalesCost;    // 품목별 판매시 최저 단가
    private Long accPrivateBrokerFee;   // 품목별 개인 판매 수수료
}
