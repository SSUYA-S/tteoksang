package com.welcome;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.ALWAYS)
public class ReduceStatistics {
    // 반기 계인 통례량 및 이벤트
    private long totalAccPrivateBrokerFee;  // 전체 누적 판매 수수료
    private long accPrivateRentFee; // 누적 임대료
    private long totalAccPrivateProductIncome;  // 개인별 전체 누적 품목 판매 비용
    private long totalAccPrivateProductOutcome; // 개인별 전체 누적 품목 구매 비용
    private long accPrivateUpgradeFee;  // 개인별 전체 누적 업그레이드 비용
    private long accPrivateEventBonus;  // 개인별 누적 이벤트 보너스

}
