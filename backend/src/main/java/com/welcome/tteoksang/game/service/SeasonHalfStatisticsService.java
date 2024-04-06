package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.result.SeasonHalfStatistics;

public interface SeasonHalfStatisticsService {

    void saveSeasonHalfStatistics(SeasonHalfStatistics seasonHalfStatistics);

    SeasonHalfStatistics loadSeasonHalfStatistics(String mongoDBKey);
//    Integer getAccGamePlayCount(String userId);
}
