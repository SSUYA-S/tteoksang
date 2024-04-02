package com.welcome;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonInclude(JsonInclude.Include.ALWAYS)
public class ReduceProductInfo {
    private long accPrivateProductPurchaseQuantity; // 품목별 누적 구매 수량
    private long maxPrivateProductPurchaseQuantity; // 품목별 개인 최대 품목 구매 수량
    private long accPrivateProductOutcome;  // 품목별 누적 구매 비용
    private long accPrivateProductSalesQuantity;    // 품목별 누적 판매 수량
    private long maxPrivateProductSalesQuantity; // 품목별 최대 판매 수량
    private long accPrivateProductIncome;   // 품목별 누적 판매 비용
    private long accPrivateProductProfit;   // 품목별 누적 판매 순이익
    private long maxPrivateProductProfit;   // 품목별 최대 판매 순이익
    private long maxPrivateProductHoldingQuantity;  // 품목별 최대 보유량
    private long maxPrivateProductPurchaseCost; // 품목별 구매시 최고 단가
    private long minPrivateProductPurchaseCost; // 품목별 구매시 최저 단가
    private long maxPrivateProductSalesCost;    // 품목별 판매시 최고 단가
    private long minPrivateProductSalesCost;    // 품목별 판매시 최저 단가
    private long accPrivateBrokerFee;   // 품목별 개인 판매 수수료
}
