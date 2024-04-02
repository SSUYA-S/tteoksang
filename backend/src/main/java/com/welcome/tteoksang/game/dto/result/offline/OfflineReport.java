package com.welcome.tteoksang.game.dto.result.offline;

import com.welcome.tteoksang.game.dto.result.half.*;
import com.welcome.tteoksang.game.dto.result.quarter.RentFeeInfo;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfflineReport {
    private Integer lastGameTurn;
    private RentFeeInfo rentFeeInfo;
    private Half halfReport;
    private QuarterReport quarterReport;
    private Integer participantCount;
    private List<RankInfo> rankInfoList;
    private TteoksangStatistics tteoksangStatistics;
    private TteokrockStatistics tteokrockStatistics;
    private BestSellerStatistics bestSellerStatistics;
}
