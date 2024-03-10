package com.welcome.tteoksang.oauth2.service;

import com.welcome.tteoksang.oauth2.dto.CustomOAuth2User;
import com.welcome.tteoksang.oauth2.dto.GoogleResponse;
import com.welcome.tteoksang.oauth2.dto.OAuth2Response;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    //DefaultOAuth2UserService는 OAuth2UserService의 구현체

    private final UserRepository userRepository;

    /**
     * 네이버나 구글의 사용자 정보를 파라미터로 받아오는 메서드
     */
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;

        if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        }
        else {
            return null;
        }

        String userEmail = oAuth2Response.getEmail();
        Optional<User> existData = userRepository.findByUserEmailAndDeletedAtIsNull(userEmail);

        //회원가입(첫 로그인)
        if (existData.isEmpty()) {
            User user = User.builder()
                    .userEmail(oAuth2Response.getEmail())
                    .userNickname(oAuth2Response.getName())
                    .build();

            userRepository.save(user);
        }

        return new CustomOAuth2User(oAuth2Response);
    }
}
