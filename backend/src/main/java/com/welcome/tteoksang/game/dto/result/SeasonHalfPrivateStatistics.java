package com.welcome.tteoksang.game.dto.result;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;
import java.util.Map;

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

    private Integer accPrivateEventOccurId;

    private Long accPrivateEventBonus;

    private int accPrivateGamePlayCount;

//    private Integer accPrivateGiveUpCount;

    private Integer accPrivatePlayTime;

    private List<Integer> accPrivateOnlineTimeSlotCount;

    private Long totalAccPrivateBrokerFee;

    private Long totalAccPrivateProductIncome;

    private Long totalAccPrivateProductOutcome;

    private Long totalAccPrivateProductProfit;

    private Long maxPrivateProductIncome;

    private Long maxPrivateProductOutcome;

    private Long maxPrivateProductProfit;

    private Long maxPrivateRentFee;

//    private Map<Integer, ProductStatistic> productStatistics;
    @Field("productStatistics")
    private Map<Integer, ProductStatistic> reduceProductInfoMap;

//    private EventStatistics eventStatistics;
}
