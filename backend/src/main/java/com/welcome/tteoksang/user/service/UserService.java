package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.dto.req.UpdateUserReq;
import java.net.URISyntaxException;

public interface UserService {

  public void updateUser(UpdateUserReq updateUserReq, User user);

  public void deleteUser(User user) throws URISyntaxException;

}
