package com.welcome.tteoksang.user.repository;

import com.welcome.tteoksang.user.dto.ProfileFrame;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileFrameRepository extends JpaRepository<ProfileFrame, Integer> {
    Optional<ProfileFrame> findByProfileFrameId(Integer profileFrameId);
}
