package com.welcome.tteoksang.game.dto.result.half;

import com.welcome.tteoksang.game.dto.result.quarter.Quarter;
import com.welcome.tteoksang.game.dto.result.quarter.RentFeeInfo;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Half {
    private Integer turn;
    private RentFeeInfo rentFeeInfo;
    private Quarter quarterReport;
    private Long totalProductIncome;
    private Long totalProductOutcome;
    private Integer totalBrokerFee;
    private Integer totalUpgradeFee;
    private Long totalRentFee;
    private Integer eventBonus; // 개인 이벤트
    private Integer participantCount; // 사용자 수
    private List<RankInfo> rankInfoList;
    private TteoksangStatistics tteoksangStatistics;
    private TteokrockStatistics tteokrockStatistics;
    private BestSellerStatistics bestSellerStatistics;
    private List<AchievementInfo>achievementList;
}
