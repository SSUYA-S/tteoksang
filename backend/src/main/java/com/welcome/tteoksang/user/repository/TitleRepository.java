package com.welcome.tteoksang.user.repository;

import com.welcome.tteoksang.user.dto.Title;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TitleRepository extends JpaRepository<Title, Integer> {
    Optional<Title> findByTitleId(Integer titleId);
}
