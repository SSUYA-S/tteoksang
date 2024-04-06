package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.result.SeasonHalfPrivateStatistics;

public interface SeasonHalfPrivateStatisticsService {
//    Long getTotalAccPrivateProductIncome(String userId);
//
//    Long getTotalAccPrivateProductOutcome(String userId);
//
//    Long getAccPrivateBrokerFee(String userId);
//
//    Long getAccPrivateUpgradeFee(String userId);
//
//    Long getAccPrivateRentFee(String userId);
//
//    Long getAccPrivateEventBonus(String userId);

    void saveSeasonHalfPrivateStatistics(SeasonHalfPrivateStatistics seasonHalfPrivateStatistics);

    SeasonHalfPrivateStatistics loadSeasonHalfPrivateStatistics(String mongoDBKey);
}
