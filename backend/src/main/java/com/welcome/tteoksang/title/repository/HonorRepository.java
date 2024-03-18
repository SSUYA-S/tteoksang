package com.welcome.tteoksang.title.repository;

import com.welcome.tteoksang.title.dto.Honor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HonorRepository extends JpaRepository<Honor, String> {
    @Query("SELECT h.title.titleId FROM Honor h WHERE h.user.userId = :userId")
    List<Integer> findTitleIdsByUserId(@Param("userId") String userId);
}
