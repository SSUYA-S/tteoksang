package com.welcome.tteoksang.game.dto.result;

import com.welcome.tteoksang.game.dto.result.half.BestSellerStatistics;
import com.welcome.tteoksang.game.dto.result.half.TteokrockStatistics;
import com.welcome.tteoksang.game.dto.result.half.TteoksangStatistics;
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
}
