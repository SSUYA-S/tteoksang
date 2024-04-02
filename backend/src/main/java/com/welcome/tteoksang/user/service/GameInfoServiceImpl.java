package com.welcome.tteoksang.user.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.game.dto.log.DisconnectLogInfo;
import com.welcome.tteoksang.game.dto.log.LogMessage;
import com.welcome.tteoksang.game.dto.log.NewgameLogInfo;
import com.welcome.tteoksang.game.dto.user.RedisGameInfo;
import com.welcome.tteoksang.game.dto.user.UserProductInfo;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
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
    private final ServerInfo serverInfo;

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
    public void startNewGame(String userId) {
        GameInfo prevGameInfo = gameInfoRepository.findById(userId).orElse(null);
        int newGameId = 1;
        String gameInfoKey = RedisPrefix.INGAMEINFO.prefix() + userId;
        if (prevGameInfo != null) {
            newGameId = prevGameInfo.getGameId() + 1;
        }

        byte[] newProducts = RedisSerializationUtil.serializeMap(new HashMap<>());

        GameInfo newGameInfo = GameInfo.builder()
                .userId(userId)
                .gameId(newGameId)// 새로운 게임 ID
                .gold(10000000L)
//                .gold(10000L)
                .warehouseLevel(1)
                .vehicleLevel(1)
                .brokerLevel(1)
                .privateEventId("없음")
                .lastPlayTurn(1)
                .products(newProducts)
                .lastConnectTime(LocalDateTime.now())
                .purchaseQuantity(0)
                .totalProductQuantity(0)
                .rentFee(0L)
                .build();

        updateGameInfo(newGameInfo);

        Map<Integer, UserProductInfo> products = RedisSerializationUtil.deserializeMap(newGameInfo.getProducts());
        inItRedisGameInfo(userId, newGameInfo, products, gameInfoKey);

        NewgameLogInfo logInfo = NewgameLogInfo.builder()
                .seasonId(serverInfo.getSeasonId())
                .gameId(newGameId)
                .userId(userId)
                .build();

        LogMessage logMessage = LogMessage.builder()
                .type("NEWGAME")
                .body(logInfo)
                .build();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String logData = objectMapper.writeValueAsString(logMessage);
            log.debug(logData);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
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
        // 동시 접속인지 확인
        if (!redisService.hasKey(gameInfoKey)) {
            if (gameInfo != null) {
                // 농산물 데이터 역직렬화
                products = RedisSerializationUtil.deserializeMap(gameInfo.getProducts());

                // 게임 데이터 불러오기 위한 정보 확인
                log.debug("[GameInfoServiceImpl] - loadGameInfo : {}, {}, {}, {}, {}"
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
            inItRedisGameInfo(userId, gameInfo, products, gameInfoKey);
        }
    }

    private void inItRedisGameInfo(String userId, GameInfo newGameInfo, Map<Integer, UserProductInfo> products, String gameInfoKey) {
        // 레디스에 이전 게임 데이터 저장
        RedisGameInfo redisGameInfo = RedisGameInfo.builder()
                .gameId(newGameInfo.getGameId())
                .gold(newGameInfo.getGold())
                .warehouseLevel(newGameInfo.getWarehouseLevel())
                .vehicleLevel(newGameInfo.getVehicleLevel())
                .brokerLevel(newGameInfo.getBrokerLevel())
                .privateEventId(newGameInfo.getPrivateEventId())
                .lastPlayTurn(newGameInfo.getLastPlayTurn())
//                    .lastConnectTime(gameInfo.getLastConnectTime())
                .lastConnectTime(LocalDateTime.now())
                .totalProductQuantity(newGameInfo.getTotalProductQuantity())
                .purchaseQuantity(newGameInfo.getPurchaseQuantity())
                .products(products) // 작물 데이터가 있는 경우 들어감
                .rentFee(newGameInfo.getRentFee())
                .build();

        redisService.setValues(gameInfoKey, redisGameInfo);

        RedisGameInfo redisGameInfoData = (RedisGameInfo) redisService.getValues(gameInfoKey);
        log.debug("[GameInfoServiceImpl] - loadGameInfo : {}, {}, {}, {}"
                , redisGameInfoData.getGameId(), redisGameInfoData.getGold(),
                redisGameInfoData.getWarehouseLevel(), redisGameInfoData.getVehicleLevel()
        );

        // DB 게임 데이터 제거
        deleteGameInfo(userId);
    }
}
