package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.GameMessageInfo;
import com.welcome.tteoksang.user.exception.TitleNotExistException;

import java.util.LinkedHashMap;

public interface PrivateInteractionService {

    GameMessageInfo changeTitle(LinkedHashMap<String, Object> body, int titleId, String userId) throws TitleNotExistException;

    GameMessageInfo buyProduct(LinkedHashMap<String, Object> body, String userId);

    GameMessageInfo sellProduct(LinkedHashMap<String, Object> body, String userId);

    GameMessageInfo upgradeWarehouse(LinkedHashMap<String, Object> body, String userId);

    GameMessageInfo upgradeBroker(LinkedHashMap<String, Object> body, String userId);

    GameMessageInfo upgradeVehicle(LinkedHashMap<String, Object> body, String userId);
}
