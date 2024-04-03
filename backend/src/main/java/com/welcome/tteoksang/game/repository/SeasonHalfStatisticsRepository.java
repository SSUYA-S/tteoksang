package com.welcome.tteoksang.game.repository;

import com.welcome.tteoksang.game.dto.result.SeasonHalfPrivateStatistics;
import com.welcome.tteoksang.game.dto.result.SeasonHalfStatistics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeasonHalfStatisticsRepository extends MongoRepository<SeasonHalfStatistics, String> {

}
