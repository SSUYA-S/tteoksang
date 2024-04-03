package com.welcome.tteoksang.game.repository;

import com.welcome.tteoksang.game.dto.result.SeasonHalfPrivateStatistics;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserStatisticsRepository extends MongoRepository<SeasonHalfPrivateStatistics, String> {
    Optional<SeasonHalfPrivateStatistics> findById(String id);
}
