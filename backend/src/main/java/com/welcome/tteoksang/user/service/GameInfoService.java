package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.user.dto.GameInfo;
import com.welcome.tteoksang.user.dto.PreviousPlayInfo;

public interface GameInfoService {

    PreviousPlayInfo searchPreviousPlayInfo(String userId);

    GameInfo searchGameInfo(String userId);

    void updateGameInfo(GameInfo gameInfo);

    void deleteGameInfo(String userId);

    void loadGameInfo(String userId);

    void  startNewGame(String userId);
}
