package com.welcome.tteoksang.game.repository;

import com.welcome.tteoksang.game.dto.ServerSeasonInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServerSeasonInfoRepository extends JpaRepository<ServerSeasonInfo, Integer> {
    /**
     * 가장 최근 시즌번호 찾기
     * @return 가장 최근 시즌번호
     */
    ServerSeasonInfo findFirstByOrderBySeasonIdDesc();
}
