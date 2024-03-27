package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.GameMessageInfo;
import com.welcome.tteoksang.user.exception.TitleNotExistException;

import java.util.LinkedHashMap;

public interface PrivateInfoService {

    GameMessageInfo getTotalInfo(LinkedHashMap<String, Object> body, String userId, String webSocketId);

    GameMessageInfo getWarehouseInfo(LinkedHashMap<String, Object> body, String userId);

    GameMessageInfo getInfraLevel(LinkedHashMap<String, Object> body, String userId);

    GameMessageInfo getMyGold(LinkedHashMap<String, Object> body, String userId);

    GameMessageInfo getPrivateEvent(LinkedHashMap<String, Object> body, String userId);

    GameMessageInfo getInGameTime(LinkedHashMap<String, Object> body, String userId);

    GameMessageInfo alertPlayTime(LinkedHashMap<String, Object> body, String userId);
}
