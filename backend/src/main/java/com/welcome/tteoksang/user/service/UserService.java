package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.dto.req.UpdateUserNameReq;
import com.welcome.tteoksang.user.dto.req.UpdateUserProfileFrameReq;
import com.welcome.tteoksang.user.dto.req.UpdateUserProfileIconReq;
import com.welcome.tteoksang.user.dto.req.UpdateUserThemeReq;
import com.welcome.tteoksang.user.exception.TitleNotExistException;

import java.net.URISyntaxException;

public interface UserService {

    void saveUserInfo(User user);

    void updateUserName(UpdateUserNameReq updateUserNameReq, User user);

    void updateUserTheme(UpdateUserThemeReq updateUserThemeReq, User user);

    void updateUserProfileIcon(UpdateUserProfileIconReq updateUserProfileIconReq, User user);

    void updateUserProfileFrame(UpdateUserProfileFrameReq updateUserProfileFrameReq, User user);

    void updateUserTitle(Integer titleId, String userId) throws TitleNotExistException;

    void deleteUser(User user) throws URISyntaxException;

}
