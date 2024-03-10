package com.welcome.tteoksang.oauth2.repository;


import com.welcome.tteoksang.oauth2.dto.GoogleRepoId;
import com.welcome.tteoksang.oauth2.dto.OAuth2AuthorizedClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoogleRepository extends JpaRepository<OAuth2AuthorizedClientEntity, GoogleRepoId> {
    void delete(OAuth2AuthorizedClientEntity entity);
}
