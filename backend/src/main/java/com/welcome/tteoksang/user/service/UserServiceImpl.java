package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.oauth2.dto.GoogleRepoId;
import com.welcome.tteoksang.oauth2.dto.OAuth2AuthorizedClientEntity;
import com.welcome.tteoksang.oauth2.repository.GoogleRepository;
import com.welcome.tteoksang.oauth2.service.GoogleRevokeService;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.dto.ProfileFrame;
import com.welcome.tteoksang.resource.dto.ProfileIcon;
import com.welcome.tteoksang.resource.dto.Theme;
import com.welcome.tteoksang.resource.repository.ProfileFrameRepository;
import com.welcome.tteoksang.resource.repository.ProfileIconRepository;
import com.welcome.tteoksang.resource.repository.ThemeRepository;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.dto.req.UpdateUserNameReq;
import com.welcome.tteoksang.user.dto.req.UpdateUserProfileFrameReq;
import com.welcome.tteoksang.user.dto.req.UpdateUserProfileIconReq;
import com.welcome.tteoksang.user.dto.req.UpdateUserThemeReq;
import com.welcome.tteoksang.user.exception.*;
import com.welcome.tteoksang.user.repository.UserRepository;

import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserDetailsService, UserService {

    private final UserRepository userRepository;
    private final ThemeRepository themeRepository;
    private final ProfileIconRepository profileIconRepository;
    private final ProfileFrameRepository profileFrameRepository;
    private final RedisService redisService;
    private final GoogleRevokeService googleRevokeService;
    private final GoogleRepository googleRepository;

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        //DB에서 조회
        return userRepository.findByUserEmailAndDeletedAtIsNull(userEmail).orElseThrow(
                UserNotExistException::new);
    }

    public void updateUserName(UpdateUserNameReq updateUserReq, User user) {
        String name = updateUserReq.getUserNickname();
        if (name == null) {
            throw new NicknameNullException();
        }
        //이름 변경
        user.setUserNickname(updateUserReq.getUserNickname());

        userRepository.save(user);
    }

    public void updateUserTheme(UpdateUserThemeReq updateUserThemeReq, User user) {
        Optional<Theme> theme = themeRepository.findById(updateUserThemeReq.getThemeId());
//        if (theme.isEmpty()) {
//            throw new NicknameNullException();
//        }
        //테마 변경
        user.setTheme(theme.get());

        userRepository.save(user);
    }

    public void updateUserProfileIcon(UpdateUserProfileIconReq updateUserProfileIconReq, User user) {
        Optional<ProfileIcon> profileIcon = profileIconRepository.findById(updateUserProfileIconReq.getProfileIconId());
//        if (profileIcon.isEmpty()) {
//            throw new NicknameNullException();
//        }
        //프로필 아이콘 변경
        user.setProfileIcon(profileIcon.get());

        userRepository.save(user);
    }

    public void updateUserProfileFrame(UpdateUserProfileFrameReq updateUserProfileFrameReq, User user) {
        Optional<ProfileFrame> profileFrame = profileFrameRepository.findById(updateUserProfileFrameReq.getProfileFrameId());
//        if (theme.isEmpty()) {
//            throw new NicknameNullException();
//        }
        //프로필 프레임 변경
        user.setProfileFrame(profileFrame.get());

        userRepository.save(user);
    }

    public void deleteUser(User user) throws URISyntaxException {

        //구글 서버로 탈퇴 요청
        Optional<OAuth2AuthorizedClientEntity> entity = googleRepository.findById(
                new GoogleRepoId("google", user.getUserNickname()));
        if (entity.isPresent()) {
            String token = entity.get().getAccessTokenValue();
            googleRepository.delete(entity.get()); //OAuth2 인증 테이블에서 제거
            googleRevokeService.revokeGoogleAccessToken(token); // 기존 토큰 만료
        }

        //관련 토큰 모두 레디스에서 제거
        String key = RedisPrefix.REFRESH_TOKEN.prefix() + user.getUserId();
        if (redisService.hasKey(key)) {
            redisService.deleteValues(key);
        }

        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

}
