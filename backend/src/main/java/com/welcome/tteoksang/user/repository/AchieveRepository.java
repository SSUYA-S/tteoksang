package com.welcome.tteoksang.user.repository;

import com.welcome.tteoksang.user.dto.Achieve;
import com.welcome.tteoksang.user.dto.AchieveId;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface AchieveRepository extends JpaRepository<Achieve, AchieveId> {
    List<Achieve> findByUserId(String userId);

}
