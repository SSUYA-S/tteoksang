package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.RedisGameInfo;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.redis.RedisSerializationUtil;
import com.welcome.tteoksang.user.dto.GameInfo;
import com.welcome.tteoksang.user.service.GameInfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisGameInfoServiceImpl implements RedisGameInfoService {

    private final RedisService redisService;
    private final GameInfoService gameInfoService;

    public void saveRedisGameInfo(String userId) {
        // 레디스에서 게임 정보 가져오기
        String gameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        if (redisService.hasKey(gameInfoKey)) {
            log.debug("이어하기를 위한 게임 데이터 저장");
            RedisGameInfo redisGameInfo = (RedisGameInfo) redisService.getValues(gameInfoKey);

            if (redisGameInfo != null) {
                // TODO: 상품 직렬화 과정이 필요함
                byte[] gameInfoProducts = RedisSerializationUtil.serializeMap(redisGameInfo.getProducts());
                // 엔티티로 저장
                GameInfo gameInfo = GameInfo.builder()
                        .userId(userId)
                        .gameId(redisGameInfo.getGameId())
                        .gold(redisGameInfo.getGold())
                        .warehouseLevel(redisGameInfo.getWarehouseLevel())
                        .vehicleLevel(redisGameInfo.getVehicleLevel())
                        .brokerLevel(redisGameInfo.getBrokerLevel())
                        .privateEventId(redisGameInfo.getPrivateEventId())
                        .lastPlayTurn(redisGameInfo.getLastPlayTurn())
                        .lastConnectTime(LocalDateTime.now())
                        .purchaseQuantity(redisGameInfo.getPurchaseQuantity())
                        .totalProductQuantity(redisGameInfo.getTotalProductQuantity())
                        .products(gameInfoProducts)
                        .rentFee(redisGameInfo.getRentFee())
                        .build();

                // 레디스에 있는 게임 정보를 데이터베이스에 저장
                gameInfoService.updateGameInfo(gameInfo);
                log.debug("DB에 게임 정보 저장");

                // 레디스에서 게임 정보 삭제
                redisService.deleteValues(gameInfoKey);
            }
        }
    }
}
