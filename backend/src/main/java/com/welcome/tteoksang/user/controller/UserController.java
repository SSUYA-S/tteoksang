package com.welcome.tteoksang.user.controller;

import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.dto.req.UpdateUserReq;
import com.welcome.tteoksang.user.dto.res.SearchUserInfoRes;
import com.welcome.tteoksang.user.service.UserService;

import java.net.URISyntaxException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @PutMapping
    public ResponseEntity<Void> updateUser(@RequestBody UpdateUserReq updateUserReq,
                                           @AuthenticationPrincipal User user) {
        userService.updateUser(updateUserReq, user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public void deleteUser(@AuthenticationPrincipal User user) throws URISyntaxException {
        userService.deleteUser(user);
    }

    @GetMapping
    public ResponseEntity<SearchUserInfoRes> searchUserInfo(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok()
                .body(
                        SearchUserInfoRes.builder()
                                .userNickname(user.getUserNickname())
                                .profileIconId(user.getProfileIcon().getProfileIconId())
                                .profileFrameId(user.getProfileFrame().getProfileFrameId())
                                .themeId(user.getTheme().getThemeId())
                                .titleId(user.getTitle().getTitleId())
                                .career(user.getCareer())
                                .build()
                );
    }
}
