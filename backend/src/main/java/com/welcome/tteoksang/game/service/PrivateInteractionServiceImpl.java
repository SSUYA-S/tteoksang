package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.*;
import com.welcome.tteoksang.game.exception.BrokerNotExistException;
import com.welcome.tteoksang.game.exception.InfraNotExistException;
import com.welcome.tteoksang.game.exception.VehicleNotExistException;
import com.welcome.tteoksang.game.exception.WarehouseNotExistException;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.dto.Broker;
import com.welcome.tteoksang.resource.dto.Vehicle;
import com.welcome.tteoksang.resource.dto.Warehouse;
import com.welcome.tteoksang.resource.repository.BrokerRepository;
import com.welcome.tteoksang.resource.repository.VehicleRepository;
import com.welcome.tteoksang.resource.repository.WarehouseRepository;
import com.welcome.tteoksang.resource.type.MessageType;
import com.welcome.tteoksang.user.dto.UserInfo;
import com.welcome.tteoksang.user.exception.TitleNotExistException;
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
public class PrivateInteractionServiceImpl implements PrivateInteractionService {

    private final UserService userService;
    private final RedisService redisService;

    private final WarehouseRepository warehouseRepository;
    private final BrokerRepository brokerRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    public GameMessageInfo changeTitle(LinkedHashMap<String, Object> body, int titleId, String userId){
        boolean isSuccess = false;
        try {
            userService.updateUserTitle(titleId, userId);
            isSuccess = true;
        }
        catch (TitleNotExistException e) {
            log.error(e.getMessage());
        }
        return GameMessageInfo.builder()
                .body(body)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo buyProduct(LinkedHashMap<String, Object> body, String userId) {


        // 유저의 게임 정보 가져오기
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        Object responseBody = body;
        boolean isSuccess = false;
        if (redisGameInfo != null) {
            int nextWarehouseLevel = redisGameInfo.getWarehouseLevel()+1;
            try {
                // 다음 레벨이 있는지 확인
                brokerRepository.findById(nextWarehouseLevel).orElseThrow(BrokerNotExistException::new);
                // 남은 금액 확인
                long remainGold = calculateUpgradeFee(redisGameInfo.getGold(), MessageType.UPGRADE_WAREHOUSE, nextWarehouseLevel);
                if (remainGold != -1) {
                    redisGameInfo.setGold(remainGold);
                    redisGameInfo.setWarehouseLevel(nextWarehouseLevel);

                    responseBody = UpgradeWarehouseInfo.builder()
                            .gold(redisGameInfo.getGold())
                            .warehouseLevel(redisGameInfo.getWarehouseLevel())
                            .build();

                    redisService.setValues(redisGameInfoKey, redisGameInfo);
                    isSuccess = true;
                } else {
                    log.debug("금액 부족");
                }
            }
            catch (WarehouseNotExistException e){
                log.error("없는 창고 입니다.");
            }
        }
        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo sellProduct(LinkedHashMap<String, Object> body, String userId) {
        return null;
    }

    @Override
    public GameMessageInfo upgradeWarehouse(LinkedHashMap<String, Object> body, String userId){
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        Object responseBody = body;
        boolean isSuccess = false;
        if (redisGameInfo != null) {
            int nextWarehouseLevel = redisGameInfo.getWarehouseLevel()+1;
            try {
                // 다음 레벨이 있는지 확인
                brokerRepository.findById(nextWarehouseLevel).orElseThrow(BrokerNotExistException::new);
                // 남은 금액 확인
                long remainGold = calculateUpgradeFee(redisGameInfo.getGold(), MessageType.UPGRADE_WAREHOUSE, nextWarehouseLevel);
                if (remainGold != -1) {
                    redisGameInfo.setGold(remainGold);
                    redisGameInfo.setWarehouseLevel(nextWarehouseLevel);

                    responseBody = UpgradeWarehouseInfo.builder()
                            .gold(redisGameInfo.getGold())
                            .warehouseLevel(redisGameInfo.getWarehouseLevel())
                            .build();

                    redisService.setValues(redisGameInfoKey, redisGameInfo);
                    isSuccess = true;
                } else {
                    log.debug("금액 부족");
                }
            }
            catch (WarehouseNotExistException e){
                log.error("없는 창고 입니다.");
            }
        }
        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo upgradeBroker(LinkedHashMap<String, Object> body, String userId) {
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        Object responseBody = body;
        boolean isSuccess = false;
        if (redisGameInfo != null) {
            int nextBrokerLevel = redisGameInfo.getBrokerLevel()+1;
            try {
                // 다음 레벨이 있는지 확인
                brokerRepository.findById(nextBrokerLevel).orElseThrow(BrokerNotExistException::new);
                // 남은 금액 확인
                long remainGold = calculateUpgradeFee(redisGameInfo.getGold(), MessageType.UPGRADE_BROKER, nextBrokerLevel);
                if(remainGold != -1) {
                    redisGameInfo.setGold(remainGold);
                    redisGameInfo.setBrokerLevel(nextBrokerLevel);

                    responseBody = UpgradeBrokerInfo.builder()
                            .gold(redisGameInfo.getGold())
                            .brokerLevel(redisGameInfo.getBrokerLevel())
                            .build();

                    redisService.setValues(redisGameInfoKey, redisGameInfo);
                    isSuccess = true;
                }
                else {
                    log.debug("금액 부족");
                }
            }
            catch (BrokerNotExistException e){
                log.error("없는 환전소 입니다.");
            }
        }
        return GameMessageInfo.builder()
                .body(responseBody)
                .isSuccess(isSuccess)
                .build();
    }

    @Override
    public GameMessageInfo upgradeVehicle(LinkedHashMap<String, Object> body, String userId) {
        RedisGameInfo redisGameInfo = getRedisGameInfo(userId);
        String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        Object responseBody = body;
        boolean isSuccess = false;
        if (redisGameInfo != null) {
            int nextVehicleLevel = redisGameInfo.getVehicleLevel()+1;
            try {
                // 다음 레벨이 있는지 확인
                vehicleRepository.findById(nextVehicleLevel).orElseThrow(VehicleNotExistException::new);
                // 남은 금액 확인
                long remainGold = calculateUpgradeFee(redisGameInfo.getGold(), MessageType.UPGRADE_VEHICLE, nextVehicleLevel);
                if(remainGold != -1) {
                    redisGameInfo.setGold(remainGold);
                    redisGameInfo.setVehicleLevel(nextVehicleLevel);

                    responseBody = UpgradeVehicleInfo.builder()
                            .gold(redisGameInfo.getGold())
                            .vehicleLevel(redisGameInfo.getVehicleLevel())
                            .build();

                    redisService.setValues(redisGameInfoKey, redisGameInfo);
                }
                else {
                    log.debug("금액 부족");
                }
            }
            catch (VehicleNotExistException e){
                log.error("없는 운송수단 입니다.");
            }
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

    private long calculateUpgradeFee(long currentGold, MessageType type, Integer level) throws InfraNotExistException {
        long upgradeFee;
        switch (type) {
            case UPGRADE_WAREHOUSE : {
                Warehouse warehouse = warehouseRepository.findById(level).orElse(null);
                upgradeFee = warehouse != null ? warehouse.getWarehouseUpgradeFee() : -1;
                break;
            }
            case UPGRADE_BROKER: {
                Broker broker = brokerRepository.findById(level).orElse(null);
                upgradeFee = broker != null ? broker.getBrokerUpgradeFee() : -1;
                break;
            }
            case UPGRADE_VEHICLE: {
                Vehicle vehicle = vehicleRepository.findById(level).orElse(null);
                upgradeFee = vehicle != null ? vehicle.getVehicleUpgradeFee() : -1;
                break;
            }
            default: {
                upgradeFee = -1;
            }
        }
        if(upgradeFee == -1)
            return -1;
        return currentGold >= upgradeFee ? currentGold - upgradeFee : -1;
    }
}
