package com.welcome.tteoksang.game.repository;

import com.welcome.tteoksang.game.dto.result.SeasonHalfPrivateStatistics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeasonHalfPrivateStatisticsRepository extends MongoRepository<SeasonHalfPrivateStatistics, String> {

}
