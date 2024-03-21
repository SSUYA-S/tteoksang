package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.user.dto.AchieveInfo;

import java.util.List;


public interface AchieveService {

    public List<AchieveInfo> searchAllAchieve(String userId);

}
