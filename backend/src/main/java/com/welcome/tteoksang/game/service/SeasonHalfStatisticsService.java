package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.result.SeasonHalfStatistics;

public interface SeasonHalfStatisticsService {
    SeasonHalfStatistics getSeasonHalfStatistics(String mongoDBKey);
//    Integer getAccGamePlayCount(String userId);
}
