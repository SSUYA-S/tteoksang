package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.user.CheckPlayTimeInfo;
import com.welcome.tteoksang.game.dto.user.RedisGameInfo;
import com.welcome.tteoksang.game.scheduler.ScheduleService;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.repository.BrokerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class PrivateScheduleServiceImpl implements PrivateScheduleService {

    @Value("${RENT_FEE}")
    private int rentFee;
    private final ScheduleService scheduleService;
    private final RedisService redisService;
    private final BrokerRepository brokerRepository;
    Map<String, CheckPlayTimeInfo> userAlertPlayTimeMap = new HashMap<>();

    //gameInfo 초기화
    @Override
    public void initGameInfoForAllUsersPerTurn() {
        userAlertPlayTimeMap.keySet().stream().forEach(
                userId -> {
                    String gameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
                    if (redisService.hasKey(gameInfoKey)) {
                        RedisGameInfo gameInfo = (RedisGameInfo) redisService.getValues(gameInfoKey);
                        //구매수량 0
                        gameInfo.setPurchaseQuantity(0);
                        //정산할 임대료 추가
                        gameInfo.setRentFee(gameInfo.getRentFee()
                                + gameInfo.getTotalProductQuantity() * rentFee);
                        //구매한 작물 수량 0
                        gameInfo.getProducts().entrySet().stream().forEach(
                                entry -> {
                                    entry.getValue().setProductPurchaseQuantity(0);
                                }
                        );
                        redisService.setValues(gameInfoKey, gameInfo);
                    }
                }
        );
        log.debug("*initGameInfoForAllUsersPerTurn");
    }


    @Override
    public void registerConnectedUser(String userId) {
        userAlertPlayTimeMap.put(userId, CheckPlayTimeInfo.builder()
                .checked(LocalDateTime.now())
                .alertCount(1)
                .build());
        log.debug("*register" + userId);
    }

    @Override
    public void removeConnectedUser(String userId) {
        scheduleService.remove(userId);
        log.debug("*remove" + userId);
    }

    @Override
    public Map<String, CheckPlayTimeInfo> getUserAlertPlayTimeMap() {
        return userAlertPlayTimeMap;
    }

    @Override
    public void updateUserAlertPlayTimeMap(String userId) {
        CheckPlayTimeInfo checkPlayTimeInfo = userAlertPlayTimeMap.get(userId);
        checkPlayTimeInfo.setAlertCount(checkPlayTimeInfo.getAlertCount() + 1);
        checkPlayTimeInfo.setChecked(LocalDateTime.now());
    }

}
