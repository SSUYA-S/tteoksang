package com.welcome.tteoksang.user.repository;

import com.welcome.tteoksang.user.dto.ProfileIcon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileIconRepository extends JpaRepository<ProfileIcon, Integer> {
    Optional<ProfileIcon> findByProfileIconId(Integer profileIconId);
}
