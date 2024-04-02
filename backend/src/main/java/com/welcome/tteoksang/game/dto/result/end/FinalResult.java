package com.welcome.tteoksang.game.dto.result.end;

import com.welcome.tteoksang.game.dto.result.half.RankInfo;
import com.welcome.tteoksang.game.dto.result.half.TteokrockStatistics;
import com.welcome.tteoksang.game.dto.result.half.TteoksangStatistics;
import com.welcome.tteoksang.game.dto.result.quarter.RentFeeInfo;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinalResult {
    private RentFeeInfo rentFeeInfo;
    private Integer season;
    private List<PrivateProductReport> privateProductReportList;
    private List<PublicProductReport> publicProductReportList;
    private List<PrivateRentReport> privateRentReportList;
    private Integer warehouseLevel;
    private Integer brokerLevel;
    private Integer vehicleLevel;
    private List<PrivateUpgradeReport> privateUpgradeReportList;
    private List<PrivateEventReport> privateEventReportList;
    private List<SpecialEvent> specialEventReportList;
    private List<Integer> achievementList;
    private Integer privateAccPrivatePlayTime;
    private List<PrivateTimeSlotReport> privateTimeSlotReportList;
    private TteoksangStatistics tteoksangStatistics;
    private TteokrockStatistics tteokrockStatistics;
    private List<RankInfo> rankInfoList;
}
