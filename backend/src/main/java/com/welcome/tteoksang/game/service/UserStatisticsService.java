package com.welcome.tteoksang.game.service;

public interface UserStatisticsService {
    Long getTotalAccPrivateProductIncome(String userId);

    Long getTotalAccPrivateProductOutcome(String userId);

    Long getAccPrivateBrokerFee(String userId);

    Long getAccPrivateUpgradeFee(String userId);

    Long getAccPrivateRentFee(String userId);

    Long getAccPrivateEventBonus(String userId);
}
