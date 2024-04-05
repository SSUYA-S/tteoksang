package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.auth.service.AuthService;
import com.welcome.tteoksang.oauth2.dto.GoogleRepoId;
import com.welcome.tteoksang.oauth2.dto.OAuth2AuthorizedClientEntity;
import com.welcome.tteoksang.oauth2.repository.GoogleRepository;
import com.welcome.tteoksang.oauth2.service.GoogleRevokeService;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.dto.ProfileFrame;
import com.welcome.tteoksang.resource.dto.ProfileIcon;
import com.welcome.tteoksang.resource.dto.Theme;
import com.welcome.tteoksang.resource.dto.Title;
import com.welcome.tteoksang.resource.repository.ProfileFrameRepository;
import com.welcome.tteoksang.resource.repository.ProfileIconRepository;
import com.welcome.tteoksang.resource.repository.ThemeRepository;
import com.welcome.tteoksang.resource.repository.TitleRepository;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.dto.UserInfo;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserDetailsService, UserService {

    private final UserRepository userRepository;
    private final ThemeRepository themeRepository;
    private final TitleRepository titleRepository;
    private final ProfileIconRepository profileIconRepository;
    private final ProfileFrameRepository profileFrameRepository;
    private final RedisService redisService;
    private final GoogleRevokeService googleRevokeService;
    private final AuthService authService;
    private final GoogleRepository googleRepository;
    private final GameInfoService gameInfoService;

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        //DB에서 조회
        return userRepository.findByUserEmailAndDeletedAtIsNull(userEmail).orElseThrow(
                UserNotExistException::new);
    }

    // 유저 정보 레디스에 저장
    @Override
    public void saveUserInfo(User user) {
        // 유저 정보 저장
        UserInfo userInfo = UserInfo.builder()
                .nickname(user.getUserNickname())
                .profileIconId(user.getProfileIcon().getProfileIconId())
                .profileFrameId(user.getProfileFrame().getProfileFrameId())
                .themeId(user.getTheme().getThemeId())
                .titleId(user.getTitle().getTitleId())
                .build();

        // 레디스에 유저 정보 저장
        String userInfoKey = RedisPrefix.USERINFO.prefix() + user.getUserId();
        redisService.setValues(userInfoKey, userInfo);
        log.debug("[UserServiceImpl] - saveUserInfo, 유저 정보 저장 여부 확인 : {}", redisService.hasKey(userInfoKey));
    }

    @Override
    public void updateUserName(UpdateUserNameReq updateUserReq, User user) {
        String name = updateUserReq.getUserNickname();
        if (name == null) {
            throw new NicknameNullException();
        }
        //이름 변경
        user.setUserNickname(updateUserReq.getUserNickname());

        userRepository.save(user);

        // 인게임 내부에서 프레임 수정하는 경우 레디스에도 반영
        updateUser(user);
    }

    @Override
    public void updateUserTheme(UpdateUserThemeReq updateUserThemeReq, User user) {
        Optional<Theme> theme = themeRepository.findById(updateUserThemeReq.getThemeId());
//        if (theme.isEmpty()) {
//            throw new NicknameNullException();
//        }
        //테마 변경
        user.setTheme(theme.get());

        userRepository.save(user);

        // 인게임 내부에서 프레임 수정하는 경우 레디스에도 반영
        updateUser(user);
    }

    @Override
    public void updateUserProfileIcon(UpdateUserProfileIconReq updateUserProfileIconReq, User user) {
        Optional<ProfileIcon> profileIcon = profileIconRepository.findById(updateUserProfileIconReq.getProfileIconId());
//        if (profileIcon.isEmpty()) {
//            throw new NicknameNullException();
//        }
        //프로필 아이콘 변경
        user.setProfileIcon(profileIcon.get());

        userRepository.save(user);

        // 인게임 내부에서 프레임 수정하는 경우 레디스에도 반영
        updateUser(user);
    }

    @Override
    public void updateUserProfileFrame(UpdateUserProfileFrameReq updateUserProfileFrameReq, User user) {
        Optional<ProfileFrame> profileFrame = profileFrameRepository.findById(updateUserProfileFrameReq.getProfileFrameId());
//        if (theme.isEmpty()) {
//            throw new NicknameNullException();
//        }
        //프로필 프레임 변경
        user.setProfileFrame(profileFrame.get());

        userRepository.save(user);

        // 인게임 내부에서 프레임 수정하는 경우 레디스에도 반영
        updateUser(user);
    }

    @Override
    public void updateUserTitle(Integer titleId, String userId) throws TitleNotExistException {
        Optional<Title> title = titleRepository.findById(titleId);
        Optional<User> user = userRepository.findByUserId(userId);
        if (title.isEmpty()) {
            throw new TitleNotExistException("해당하는 칭호가 없습니다.");
        }
        //프로필 프레임 변경
        user.get().setTitle(title.get());

        userRepository.save(user.get());
        // 레디스에 있는 유저 정보 변경
        updateUser(user.get());
    }

    @Override
    public void deleteUser(User user) throws URISyntaxException {

        //구글 서버로 탈퇴 요청
        Optional<OAuth2AuthorizedClientEntity> entity = googleRepository.findById(
                new GoogleRepoId("google", user.getUserGoogleName()));
        if (entity.isPresent()) {
            String token = entity.get().getAccessTokenValue();
            googleRepository.delete(entity.get()); //OAuth2 인증 테이블에서 제거
            googleRevokeService.revokeGoogleAccessToken(token); // 기존 토큰 만료
        }

        String userId = user.getUserId();
        // 로그아웃 과정
        authService.logoutUser(userId);
        // DB 인게임 정보 제거
        gameInfoService.deleteGameInfo(userId);

        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public User findTwn(String email) {
        return userRepository.findByUserEmail(email).orElseThrow(
                UserNotExistException::new);
    }


    public void updateUser(User user) {
        // 인게임 내부에서 프레임 수정하는 경우 레디스에도 반영
        String userInfoKey = RedisPrefix.USERINFO.prefix() + user.getUserId();
        if (redisService.hasKey(userInfoKey)) {
            saveUserInfo(user);
        }
    }
}
