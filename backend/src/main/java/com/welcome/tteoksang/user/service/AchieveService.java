package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.user.dto.Achieve;
import com.welcome.tteoksang.user.dto.AchieveRes;

import java.util.List;


public interface AchieveService {

    public List<AchieveRes> searchAllAchieve(String userId);

}
