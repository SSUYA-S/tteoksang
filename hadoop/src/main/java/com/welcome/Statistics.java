package com.welcome;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
//@JsonInclude(JsonInclude.Include.ALWAYS)
public class Statistics {
    // 개인통계량 및 이벤트
    private Long accPrivateRentFee; // 누적 임대료
    private Long maxPrivateProductIncome;  // 하나의 판매 단위에서 최대 판매 비용
    private int accPrivatePlayTime; // 누적 플레이 시간
    private int accPrivateOnlineTimeSlotCount;  // 시간대별 접속 횟수
    private int accPrivateEventOccurCount;  // 개인 이벤트 발생 횟수

    // 농산물 품목별 개인 통계량
    private Map<Long, ProductInfo> productInfoMap;

    public Statistics() {
        productInfoMap = new HashMap<>();
    }

    // productId를 키로 ProductInfo 추가
    public void addProductInfo(Long productId, ProductInfo productInfo) {
        productInfoMap.put(productId, productInfo);
    }

    // ProductInfo 맵 반환
    public Map<Long, ProductInfo> getProductInfoMap() {
        return productInfoMap;
    }
}



