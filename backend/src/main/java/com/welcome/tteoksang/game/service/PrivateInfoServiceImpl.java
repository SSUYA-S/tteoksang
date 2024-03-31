package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.*;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.repository.BrokerRepository;
import com.welcome.tteoksang.resource.repository.VehicleRepository;
import com.welcome.tteoksang.resource.repository.WarehouseRepository;
import com.welcome.tteoksang.user.dto.UserInfo;
import com.welcome.tteoksang.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class PrivateInfoServiceImpl implements PrivateInfoService {

    private final RedisService redisService;

    @Override
    public GameMessageInfo getTotalInfo(LinkedHashMap<String, Object> body, String userId, String webSocketId){
        // FIXME:서버 게임 정보 불러오기

        // FIXME:레디스에 있는 개인별 게임 정보 반영
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        UserInfo userInfo = getUserInfo(userId, webSocketId);
        Object responseBody = body;
        boolean isSuccess = false;
        if (redisGameInfo != null) {
            responseBody = TotalInfo.builder()
                    .gold(redisGameInfo.getGold())
                    .privateEventId(redisGameInfo.getPrivateEventId())
                    .specialEventId("없음")   // 서버의 특수 이벤트
                    .inGameTime(LocalDateTime.now().toString())
                    .turnStartTime(ServerInfo.turnStartTime.toString())    // 턴 시작 시간 => 서버에서 가져옴
                    .turn(ServerInfo.currentTurn)    // 서버의 턴 정보
                    .themeId(userInfo.getThemeId())
                    .products(redisGameInfo.getProducts())
                    .productInfoList(new ArrayList<>())
                    .buyAbleProductIdList(new ArrayList<>())
                    .purchasedQuantity(redisGameInfo.getPurchaseQuantity())
                    .warehouseLevel(redisGameInfo.getWarehouseLevel())
                    .vehicleLevel(redisGameInfo.getVehicleLevel())
                    .brokerLevel(redisGameInfo.getBrokerLevel())
                    .build();
            isSuccess = true;
        } else {
            log.error("[PrivateInfoServiceImpl] - getTotalInfo: 없는 게임정보 입니다.");
        }
        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo getWarehouseInfo(LinkedHashMap<String, Object> body, String userId){
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        Object responseBody = body;
        boolean isSuccess = false;
        if (redisGameInfo != null) {
            responseBody = UserWarehouseInfo.builder()
                    .warehouseLevel(redisGameInfo.getWarehouseLevel())
                    .vehicleLevel(redisGameInfo.getVehicleLevel())
                    .brokerLevel(redisGameInfo.getBrokerLevel())
                    .products(redisGameInfo.getProducts())
                    .build();
            isSuccess = true;
        } else {
            log.error("[PrivateInfoServiceImpl] - getWarehouseInfo:없는 게임정보 입니다.");
        }
        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo getInfraLevel(LinkedHashMap<String, Object> body, String userId) {
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        Object responseBody = body;
        boolean isSuccess = false;
        if (redisGameInfo != null) {
            responseBody = UserInfraInfo.builder()
                    .warehouseLevel(redisGameInfo.getWarehouseLevel())
                    .vehicleLevel(redisGameInfo.getVehicleLevel())
                    .brokerLevel(redisGameInfo.getBrokerLevel())
                    .build();
            isSuccess = true;
        } else {
            log.error("[PrivateInfoServiceImpl] - getInfraInfo:없는 게임정보 입니다.");
        }
        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo getMyGold(LinkedHashMap<String, Object> body, String userId) {
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        Object responseBody = body;
        boolean isSuccess = false;
        if (redisGameInfo != null) {
            responseBody = new HashMap<>();
            ((Map<String, Long>) responseBody).put("gold", redisGameInfo.getGold());
            isSuccess = true;
        } else {
            log.error("[PrivateInfoServiceImpl] - getMyGold:없는 게임정보 입니다.");
        }
        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo getPrivateEvent(LinkedHashMap<String, Object> body, String userId) {
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        Object responseBody = body;
        boolean isSuccess = false;
        if (redisGameInfo != null) {
            responseBody = PrivateEventInfo.builder()
                    .gold(redisGameInfo.getGold())
                    .privateEventId(redisGameInfo.getPrivateEventId())
                    .build();
            isSuccess = true;
        } else {
            log.error("[PrivateInfoServiceImpl] - getPrivateEvent:없는 게임정보 입니다.");
        }
        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo getInGameTime(LinkedHashMap<String, Object> body, String userId) {
        //FIXME: 서버에 있는 게임 시간 불러오기
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        Object responseBody = body;
        boolean isSuccess = false;
        if (redisGameInfo != null) {
            responseBody = UserInGameTimeInfo.builder()
                    .inGameTime(LocalDateTime.now().toString())
                    .turnStartTime(ServerInfo.turnStartTime.toString())
                    .turn(ServerInfo.currentTurn)
                    .build();
            isSuccess = true;
        } else {
            log.error("[PrivateInfoServiceImpl] - getInGameTime: 없는 게임정보 입니다.");
        }
        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo alertPlayTime(LinkedHashMap<String, Object> body, String userId) {
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        Object responseBody = body;
        boolean isSuccess = false;
        if (redisGameInfo != null) {
            Duration duration = Duration.between(redisGameInfo.getLastConnectTime(), LocalDateTime.now());
            responseBody = new HashMap<>();
            ((Map<String, Long>) responseBody).put("playTime", duration.toSeconds());
            isSuccess = true;
        } else {
            log.error("[PrivateInfoServiceImpl] - alertPlayTime: 없는 게임정보 입니다.");
        }
        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    private RedisGameInfo getRedisGameInfo(String userId) {
        // 레디스에 있는 게임 정보 불러오기
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        RedisGameInfo redisGameInfo = null;
        if (redisService.hasKey(redisGameInfoKey)) {
            redisGameInfo = (RedisGameInfo) redisService.getValues(redisGameInfoKey);
        }
        return redisGameInfo;
    }
    private UserInfo getUserInfo(String userId, String webSocketId) {
        String userInfoKey = RedisPrefix.USERINFO.prefix() + userId;
        // 레디스에서 유저 정보 가져오기
        UserInfo userInfo = (UserInfo) redisService.getValues(userInfoKey);
        log.debug("[PrivateInfoServiceImpl] - UserName: {}, webSocketId: {}", userInfo.getNickname(), webSocketId);
        return userInfo;
    }
}
