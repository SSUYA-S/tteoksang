package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.result.SeasonHalfPrivateStatistics;
import com.welcome.tteoksang.game.repository.UserStatisticsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserStatisticsServiceImpl implements UserStatisticsService{

    private final UserStatisticsRepository userStatisticsRepository;

    @Override
    public Long getTotalAccPrivateProductIncome(String userId) {
        return userStatisticsRepository.findById(userId)
                .map(SeasonHalfPrivateStatistics::getTotalAccPrivateProductIncome)
                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
    }

    @Override
    public Long getTotalAccPrivateProductOutcome(String userId) {
        return userStatisticsRepository.findById(userId)
                .map(SeasonHalfPrivateStatistics::getTotalAccPrivateProductOutcome)
                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
    }

    @Override
    public Long getAccPrivateBrokerFee(String userId) {
        return userStatisticsRepository.findById(userId)
                .map(SeasonHalfPrivateStatistics::getTotalAccPrivateBrokerFee)
                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
    }

    @Override
    public Long getAccPrivateUpgradeFee(String userId) {
        return userStatisticsRepository.findById(userId)
                .map(SeasonHalfPrivateStatistics::getAccPrivateUpgradeFee)
                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
    }

    @Override
    public Long getAccPrivateRentFee(String userId) {
        return userStatisticsRepository.findById(userId)
                .map(SeasonHalfPrivateStatistics::getAccPrivateRentFee)
                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
    }

    @Override
    public Long getAccPrivateEventBonus(String userId) {
        return userStatisticsRepository.findById(userId)
                .map(SeasonHalfPrivateStatistics::getAccPrivateEventBonus)
                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
    }

//    @Override
//    public Long getAccPrivateGamePlayCount(String userId) {
//        return userStatisticsRepository.findById(userId)
//                .map(SeasonHalfPrivateStatistics::getAccPrivateGamePlayCount)
//                .orElse(null); // 적절한 예외 처리나 기본값 설정을 고려해야 함
//    }
}
