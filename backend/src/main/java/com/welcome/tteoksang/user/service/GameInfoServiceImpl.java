package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.game.dto.RedisGameInfo;
import com.welcome.tteoksang.game.dto.UserProductInfo;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisSerializationUtil;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.user.dto.GameInfo;
import com.welcome.tteoksang.user.dto.PreviousPlayInfo;
import com.welcome.tteoksang.user.repository.GameInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameInfoServiceImpl implements GameInfoService {

    private final GameInfoRepository gameInfoRepository;
    private final RedisService redisService;

    @Override
    public PreviousPlayInfo searchPreviousPlayInfo(String userId) {
        GameInfo gameInfo = gameInfoRepository.findById(userId).orElse(null);
        if (gameInfo != null) {
            return PreviousPlayInfo.builder()
                    .previousPlayDate(gameInfo.getLastConnectTime().toString())
                    .build();
        } else {
            return PreviousPlayInfo.builder()
                    .previousPlayDate("")
                    .build();
        }
    }

    @Override
    public GameInfo searchGameInfo(String userId) {
        return gameInfoRepository.findById(userId).orElse(null);
    }

    @Override
    public void updateGameInfo(GameInfo gameInfo) {
        gameInfoRepository.save(gameInfo);
    }

    @Override
    public void deleteGameInfo(String userId) {
        gameInfoRepository.deleteById(userId);
    }

    // 게임 정보 레디스에 저장
    public void loadGameInfo(String userId) {
        // DB에서 gameInfo 불러오기
        GameInfo gameInfo = searchGameInfo(userId);
        Map<Integer, UserProductInfo> products;
        String gameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        if (gameInfo != null) {
            // 농산물 데이터 역직렬화
            products = RedisSerializationUtil.deserializeMap(gameInfo.getProducts());

            // 게임 데이터 불러오기 위한 정보 확인
            log.debug("[InGameChannelInterceptor] - inGameInfo : {}, {}, {}, {}, {}"
                    , gameInfo.getGameId(), gameInfo.getGold(),
                    gameInfo.getWarehouseLevel(), gameInfo.getVehicleLevel(), products.toString()
            );
        }
        // FIXME:게임 데이터가 없는 경우 새로운 게임
        else {
            products = new HashMap<>();
            gameInfo = GameInfo.builder()
                    .userId(userId)
                    .gameId(1)// 현재 게임 ID
                    .gold(10000000L)
                    .warehouseLevel(1)
                    .vehicleLevel(1)
                    .brokerLevel(1)
                    .privateEventId("없음")
                    .lastPlayTurn(1)
                    .lastConnectTime(LocalDateTime.now())
                    .purchaseQuantity(0)
                    .totalProductQuantity(0)
                    .rentFee(0L)
                    .build();
        }

        // 레디스에 이전 게임 데이터 저장
        RedisGameInfo redisGameInfo = RedisGameInfo.builder()
                .gameId(gameInfo.getGameId())
                .gold(gameInfo.getGold())
                .warehouseLevel(gameInfo.getWarehouseLevel())
                .vehicleLevel(gameInfo.getVehicleLevel())
                .brokerLevel(gameInfo.getBrokerLevel())
                .privateEventId(gameInfo.getPrivateEventId())
                .lastPlayTurn(gameInfo.getLastPlayTurn())
                .lastConnectTime(gameInfo.getLastConnectTime())
                .totalProductQuantity(gameInfo.getTotalProductQuantity())
                .purchaseQuantity(gameInfo.getPurchaseQuantity())
                .products(products) // 작물 데이터가 있는 경우 들어감
                .rentFee(gameInfo.getRentFee())
                .build();

        redisService.setValues(gameInfoKey, redisGameInfo);

        RedisGameInfo redisGameInfoData = (RedisGameInfo) redisService.getValues(gameInfoKey);
        log.debug("[InGameChannelInterceptor] - redisGameInfoData : {}, {}, {}, {}"
                , redisGameInfoData.getGameId(), redisGameInfoData.getGold(),
                redisGameInfoData.getWarehouseLevel(), redisGameInfoData.getVehicleLevel()
        );

        // DB 게임 데이터 제거
        deleteGameInfo(userId);
    }
}
