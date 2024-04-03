package com.welcome.tteoksang.game.dto.result;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document
public class SeasonHalfPrivateStatistics {
    @Id
    private String id;
    private Long accPrivateRentFee;
    private Long accPrivateUpgradeFee;
    private Long accPrivateEventBonus;
    private Integer accPrivateGiveUpCount;
    private Integer accPrivatePlayTime;
    private List<TimeSlotCount> accPrivateOnlineTimeSlotCount;
    private Long totalAccPrivateBrokerFee;
    private Long totalAccPrivateProductIncome;
    private Long totalAccPrivateProductOutcome;
    private Long totalAccPrivateProductProfit;
    private Long maxPrivateProductIncome;
    private Long maxPrivateProductOutcome;
    private Long maxPrivateProductProfit;
    private Long maxPrivateRentFee;
    private List<ProductStatistic> productStatistics;
    private EventStatistics eventStatistics;
}
