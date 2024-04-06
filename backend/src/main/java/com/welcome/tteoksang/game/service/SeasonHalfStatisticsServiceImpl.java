package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.result.SeasonHalfPrivateStatistics;
import com.welcome.tteoksang.game.dto.result.SeasonHalfStatistics;
import com.welcome.tteoksang.game.repository.SeasonHalfPrivateStatisticsRepository;
import com.welcome.tteoksang.game.repository.SeasonHalfStatisticsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeasonHalfStatisticsServiceImpl implements SeasonHalfStatisticsService {

    private final SeasonHalfStatisticsRepository seasonHalfStatisticsRepository;

    @Override
    public void saveSeasonHalfStatistics(SeasonHalfStatistics seasonHalfStatistics) {
        seasonHalfStatisticsRepository.save(seasonHalfStatistics);
    }

    @Override
    public SeasonHalfStatistics loadSeasonHalfStatistics(String mongoDBKey) {
        return seasonHalfStatisticsRepository.findById(mongoDBKey).orElse(null);
    }

//    @Override
//    public Integer getAccGamePlayCount(String userId) {
//        return seasonHalfStatisticsRepository.findById(userId)
//                .map(SeasonHalfStatistics::getAccGamePlayCount)
//                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
//    }
}
