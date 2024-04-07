package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.result.SeasonHalfPrivateStatistics;

import com.welcome.tteoksang.game.repository.SeasonHalfPrivateStatisticsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeasonHalfPrivateStatisticsServiceImpl implements SeasonHalfPrivateStatisticsService {

    private final SeasonHalfPrivateStatisticsRepository seasonHalfPrivateStatisticsRepository;

    @Override
    public SeasonHalfPrivateStatistics saveSeasonHalfPrivateStatistics(SeasonHalfPrivateStatistics seasonHalfStatistics) {
        SeasonHalfPrivateStatistics privateStatistics = null;
        try {
            privateStatistics= seasonHalfPrivateStatisticsRepository.save(seasonHalfStatistics);
        }
        catch (Exception e) {
            log.error(e.getMessage());
        }
        return privateStatistics;
    }

    @Override
    public SeasonHalfPrivateStatistics loadSeasonHalfPrivateStatistics(String mongoDBKey) {
        return seasonHalfPrivateStatisticsRepository.findById(mongoDBKey).orElse(null);
    }

//    @Override
//    public Long getTotalAccPrivateProductIncome(String userId) {
//        return seasonHalfPrivateStatisticsRepository.findById(userId)
//                .map(SeasonHalfPrivateStatistics::getTotalAccPrivateProductIncome)
//                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
//    }
//
//    @Override
//    public Long getTotalAccPrivateProductOutcome(String userId) {
//        return seasonHalfPrivateStatisticsRepository.findById(userId)
//                .map(SeasonHalfPrivateStatistics::getTotalAccPrivateProductOutcome)
//                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
//    }
//
//    @Override
//    public Long getAccPrivateBrokerFee(String userId) {
//        return seasonHalfPrivateStatisticsRepository.findById(userId)
//                .map(SeasonHalfPrivateStatistics::getTotalAccPrivateBrokerFee)
//                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
//    }
//
//    @Override
//    public Long getAccPrivateUpgradeFee(String userId) {
//        return seasonHalfPrivateStatisticsRepository.findById(userId)
//                .map(SeasonHalfPrivateStatistics::getAccPrivateUpgradeFee)
//                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
//    }
//
//    @Override
//    public Long getAccPrivateRentFee(String userId) {
//        return seasonHalfPrivateStatisticsRepository.findById(userId)
//                .map(SeasonHalfPrivateStatistics::getAccPrivateRentFee)
//                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
//    }
//
//    @Override
//    public Long getAccPrivateEventBonus(String userId) {
//        return seasonHalfPrivateStatisticsRepository.findById(userId)
//                .map(SeasonHalfPrivateStatistics::getAccPrivateEventBonus)
//                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
//    }
//
//    @Override
//    public Integer getAccPrivateGamePlayCount(String userId) {
//        return seasonHalfStatisticsRepository.findById(userId)
//                .map(SeasonHalfStatistics::getAccGamePlayCount)
//                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
//    }
}
