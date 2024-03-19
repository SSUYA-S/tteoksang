package com.welcome.tteoksang.user.repository;

import com.welcome.tteoksang.user.dto.Theme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ThemeRepository extends JpaRepository<Theme, Integer> {
    Optional<Theme> findByThemeId(Integer themeId);
}
