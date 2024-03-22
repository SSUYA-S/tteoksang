package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.user.dto.GameInfo;
import com.welcome.tteoksang.user.dto.PreviousPlayInfo;
import com.welcome.tteoksang.user.repository.GameInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameInfoServiceImpl implements GameInfoService {

    private final GameInfoRepository gameInfoRepository;

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

}
