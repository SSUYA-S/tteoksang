package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.dto.req.UpdateUserNameReq;
import com.welcome.tteoksang.user.dto.req.UpdateUserProfileFrameReq;
import com.welcome.tteoksang.user.dto.req.UpdateUserProfileIconReq;
import com.welcome.tteoksang.user.dto.req.UpdateUserThemeReq;

import java.net.URISyntaxException;

public interface UserService {

    public void saveUserInfo(User user);

    public void updateUserName(UpdateUserNameReq updateUserNameReq, User user);

    public void updateUserTheme(UpdateUserThemeReq updateUserThemeReq, User user);

    public void updateUserProfileIcon(UpdateUserProfileIconReq updateUserProfileIconReq, User user);

    public void updateUserProfileFrame(UpdateUserProfileFrameReq updateUserProfileFrameReq, User user);

    public void deleteUser(User user) throws URISyntaxException;

}
