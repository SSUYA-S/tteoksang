package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.oauth2.dto.GoogleRepoId;
import com.welcome.tteoksang.oauth2.dto.OAuth2AuthorizedClientEntity;
import com.welcome.tteoksang.oauth2.repository.GoogleRepository;
import com.welcome.tteoksang.oauth2.service.GoogleRevokeService;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.dto.req.UpdateUserReq;
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
  private final RedisService redisService;
  private final GoogleRevokeService googleRevokeService;
  private final GoogleRepository googleRepository;

  @Override
  public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
    //DB에서 조회
    return userRepository.findByUserEmailAndDeletedAtIsNull(userEmail).orElseThrow(
        UserNotExistException::new);
  }

  public void updateUser(UpdateUserReq updateUserReq, User user) {
    String name = updateUserReq.getUserNickname();
    if (name == null) {
      throw new NicknameNullException();
    }
    //이름 변경
    user.setUserNickname(updateUserReq.getUserNickname());

    userRepository.save(user);
  }

  public void deleteUser(User user) throws URISyntaxException {

    //구글 서버로 탈퇴 요청
    Optional<OAuth2AuthorizedClientEntity> entity = googleRepository.findById(
        new GoogleRepoId("google", user.getUserNickname()));
    if (entity.isPresent()) {
      String token = entity.get().getAccessTokenValue();
      googleRepository.delete(entity.get()); //테이블에서 제거
      googleRevokeService.revokeGoogleAccessToken(token);
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
