package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.user.exception.TitleNotExistException;

import java.util.LinkedHashMap;

public interface PrivateService {

    Object[] changeTitle(LinkedHashMap<String, Object> body, int titleId, String userId) throws TitleNotExistException;

    Object[] upgradeWarehouse(LinkedHashMap<String, Object> body, String userId);

    Object[] upgradeBroker(LinkedHashMap<String, Object> body, String userId);

    Object[] upgradeVehicle(LinkedHashMap<String, Object> body, String userId);

    Object[] getTotalInfo(LinkedHashMap<String, Object> body, String userId, String webSocketId);

    Object[] getWarehouseInfo(LinkedHashMap<String, Object> body, String userId);

    Object[] getInfraLevel(LinkedHashMap<String, Object> body, String userId);

    Object[] getMyGold(LinkedHashMap<String, Object> body, String userId);

    Object[] getPrivateEvent(LinkedHashMap<String, Object> body, String userId);

    Object[] getInGameTime(LinkedHashMap<String, Object> body, String userId);
}
