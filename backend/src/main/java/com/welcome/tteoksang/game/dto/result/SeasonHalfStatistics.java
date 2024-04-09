package com.welcome.tteoksang.game.dto.result;

import com.welcome.tteoksang.game.dto.result.half.BestSellerStatistics;
import com.welcome.tteoksang.game.dto.result.half.TteokValues;
import com.welcome.tteoksang.game.dto.result.half.TteokrockStatistics;
import com.welcome.tteoksang.game.dto.result.half.TteoksangStatistics;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document
public class SeasonHalfStatistics {
    @Id
    private String id;

    @Field("totalAccRentFee")
    private Long totalAccRentFee;

    @Field("accBrokerFee")
    private Long accBrokerFee;

    @Field("accGiveUpCount")
    private Integer accGiveUpCount;

    @Field("accGamePlayCount")
    private Integer accGamePlayCount;

    @Field("accOnlineTimeSlotCount")
    private List<Integer> accOnlineTimeSlotCount;

//    @Field("maxRentFee")
//    private Long maxRentFee;

    @Field("productStatistics")
    private Map<Integer, ServerProductStatistic> productStatistics;

    @Field("tteoksangStatistics")
    private TteoksangStatistics tteoksangStatistics;

    @Field("tteokrockStatistics")
    private TteokrockStatistics tteokrockStatistics;

    @Field("bestSellerStatistics")
    private BestSellerStatistics bestSellerStatistics;

    public void accumulateTotalAccRentFee(Long totalAccRentFee) {
        if(this.totalAccRentFee == null) this.totalAccRentFee = 0L;
        this.totalAccRentFee += totalAccRentFee;
    }

    public void accumulateAccBrokerFee(Long accBrokerFee) {
        if(this.accBrokerFee == null) this.accBrokerFee = 0L;
        this.accBrokerFee += accBrokerFee;
    }

    public void accumulateAccGiveUpCount(Integer accGiveUpCount) {
        if(this.accGiveUpCount == null) this.accGiveUpCount = 0;
        this.accGiveUpCount += accGiveUpCount;
    }

    public void accumulateAccGamePlayCount(Integer accGamePlayCount) {
        if(this.accGamePlayCount == null) this.accGamePlayCount = 0;
        this.accGamePlayCount += accGamePlayCount;
    }

    public void accumulateAccOnlineTimeSlotCount(List<Integer> accOnlineTimeSlotCount) {
        if(this.accOnlineTimeSlotCount == null) {
            this.accOnlineTimeSlotCount = new ArrayList<>();
            for(int i=0; i<8; i++)
                this.accOnlineTimeSlotCount.add(0);
        }
        for(int i=0; i<8; i++)
            this.accOnlineTimeSlotCount.set(i, this.accOnlineTimeSlotCount.get(i) + accOnlineTimeSlotCount.get(i));
    }

//    public void findMaxRentFee(Long maxRentFee) {
//        if(this.maxRentFee == null) this.maxRentFee = 0L;
//        this.maxRentFee = Math.max(this.maxRentFee, maxRentFee);
//    }

    public void updateProductStatics(Map<Integer, ProductStatistic> productStatistics) {
        if(this.productStatistics == null) this.productStatistics = new HashMap<>();
        for(Map.Entry<Integer, ProductStatistic> entry : productStatistics.entrySet()) {
            Integer productId = entry.getKey();
            ProductStatistic newStat = entry.getValue();

            ServerProductStatistic existingStat = this.productStatistics.getOrDefault(productId, new ServerProductStatistic());

            // 누적 로직 예시
            existingStat.setAccProductSalesQuantity(existingStat.getAccProductSalesQuantity() + newStat.getAccPrivateProductSalesQuantity());
            existingStat.setAccProductPurchaseQuantity(existingStat.getAccProductPurchaseQuantity() + newStat.getAccPrivateProductPurchaseQuantity());
            existingStat.setAccProductIncome(existingStat.getAccProductIncome() + newStat.getAccPrivateProductIncome());
            existingStat.setAccProductOutcome(existingStat.getAccProductOutcome() + newStat.getAccPrivateProductOutcome());
            existingStat.setAccProductProfit(existingStat.getAccProductProfit() + newStat.getAccPrivateProductProfit());
            existingStat.setAccProductBrokerFee(existingStat.getAccProductBrokerFee() + newStat.getAccPrivateBrokerFee());

            // 최대값 로직 예시
            existingStat.setMaxProductSalesQuantity(Math.max(existingStat.getMaxProductSalesQuantity(), newStat.getMaxPrivateProductSalesQuantity()));
            existingStat.setMaxProductPurchaseQuantity(Math.max(existingStat.getMaxProductPurchaseQuantity(), newStat.getMaxPrivateProductPurchaseQuantity()));
            existingStat.setMaxProductProfit(Math.max(existingStat.getMaxProductProfit(), newStat.getMaxPrivateProductProfit()));
            existingStat.setMaxProductHoldingQuantity(Math.max(existingStat.getMaxProductHoldingQuantity(), newStat.getMaxPrivateProductHoldingQuantity()));
            existingStat.setMaxProductSalesCost(Math.max(existingStat.getMaxProductSalesCost(), newStat.getMaxPrivateProductSalesCost()));
            existingStat.setMaxProductPurchaseCost(Math.max(existingStat.getMaxProductPurchaseCost(), newStat.getMaxPrivateProductPurchaseCost()));

            // 최소값 로직 예시
            existingStat.setMinProductPurchaseCost(Math.min(existingStat.getMinProductPurchaseCost(), newStat.getMinPrivateProductPurchaseCost()));
            existingStat.setMinProductSalesCost(Math.min(existingStat.getMinProductSalesCost(), newStat.getMinPrivateProductSalesCost()));

            // 업데이트된 통계를 다시 맵에 저장
            this.productStatistics.put(productId, existingStat);
        }
    }

    public void findBestSeller() {
        if(this.bestSellerStatistics == null) this.bestSellerStatistics = new BestSellerStatistics(new ArrayList<>());
        List<TteokValues> bestSellers = this.productStatistics.entrySet().stream()
                .map(entry -> new TteokValues(entry.getKey(), entry.getValue().getAccProductSalesQuantity()))
                .sorted((a, b) -> b.getValue().compareTo(a.getValue())) // 내림차순 정렬
                .collect(Collectors.toList());
        this.bestSellerStatistics.setValues(bestSellers);
    }
}
