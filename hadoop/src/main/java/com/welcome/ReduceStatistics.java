package com.welcome;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.ALWAYS)
public class ReduceStatistics {
    // 반기 계인 통례량 및 이벤트
    private long totalAccPrivateBrokerFee;  // 전체 누적 판매 수수료
    private long accPrivateRentFee; // 누적 임대료
    private long totalAccPrivateProductIncome;  // 개인별 전체 누적 품목 판매 비용 - 반기 -> 수익 결산 -> 작물 판매 비용
    private long totalAccPrivateProductOutcome; // 개인별 전체 누적 품목 구매 비용 - 반기 -> 지출 결산 -> 작물 구매 비용
    private long accPrivateUpgradeFee;  // 개인별 전체 누적 업그레이드 비용 - 반기 -> 지출 결산 -> 인프라 업그레이드 비용
    private long accPrivateEventBonus;  // 개인별 누적 이벤트 보너스 - 반기 -> 이벤트 보너스
    private long totalAccPrivateProductProfit;  // 개인별 누적 판매 순이익 - 반기 -> 랭킹
    private long maxPrivateProductOutcome;  // 하나의 구매 단위 최대 구매 비용 - 랭킹 -> 큰손
    private long maxPrivateProductIncome;   // 하나의 판매 단위 최대 판매 비용
    private long maxPrivateProductProfit;   // 하나의 판매 단위 최대 순이익 - 랭킹 -> 벼락부자 / 판매 금액 - 수수료 - (평균 구매 단가 * 판매 수량)
    private int accPrivatePlayTime;   // 누적 플레이 시간
    private int[] accPrivateOnlineTimeSlotCount = new int[8];    // 시간대별 접속 횟수
    private int accPrivateGamePlayCount;   // 개인별 누적 게임 생성 횟수
    private long accPrivateEventOccurId;    // 개인 이벤트 발생 횟수

    // 반기 농산물 품목별 개인 통계량
    private Map<Long, ReduceProductInfo> reduceProductInfoMap;

    public ReduceStatistics() {reduceProductInfoMap = new HashMap<>();}

    // productId를 키로 ReduceProductInfo 추가
    public void addReduceProductInfo(Long productId, ReduceProductInfo reduceProductInfo) { reduceProductInfoMap.put(productId, reduceProductInfo); }

    //  ReduceProductInfo 맵 반환
    public Map<Long, ReduceProductInfo> getReduceProductInfoMap() { return reduceProductInfoMap; }


}
