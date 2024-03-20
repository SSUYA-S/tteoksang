package com.welcome.tteoksang.user.repository;

import com.welcome.tteoksang.user.dto.GameInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameInfoRepository extends JpaRepository<GameInfo, String> {

}
