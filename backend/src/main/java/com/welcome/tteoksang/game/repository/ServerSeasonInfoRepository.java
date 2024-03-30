package com.welcome.tteoksang.game.repository;

import com.welcome.tteoksang.game.dto.ServerSeasonInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServerSeasonInfoRepository extends JpaRepository<ServerSeasonInfo, Integer> {
    ServerSeasonInfo findFirstByOrderBySeasonIdDesc();
}
