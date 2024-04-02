package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.user.CheckPlayTimeInfo;

import java.util.Map;

public interface PrivateScheduleService {
    void initGameInfoForAllUsersPerTurn();

    void registerConnectedUser(String userId);

    void removeConnectedUser(String userId);

    Map<String, CheckPlayTimeInfo> getUserAlertPlayTimeMap();

    void updateUserAlertPlayTimeMap(String userId,long offsetPlayTime);
}
