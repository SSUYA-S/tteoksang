package com.welcome.tteoksang.game.dto.result;

import com.welcome.tteoksang.game.dto.result.half.BestSellerStatistics;
import com.welcome.tteoksang.game.dto.result.half.TteokrockStatistics;
import com.welcome.tteoksang.game.dto.result.half.TteoksangStatistics;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    @Field("maxRentFee")
    private Long maxRentFee;

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

    public void findMaxRentFee(Long maxRentFee) {
        if(this.maxRentFee == null) this.maxRentFee = 0L;
        this.maxRentFee = Math.max(this.maxRentFee, maxRentFee);
    }
}
