package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.game.dto.result.offline.OfflineReport;

public interface ReportService {
    GameMessageRes sendQuarterResult(String userId, String webSocketId);
    GameMessageRes sendHalfResult(String userId, String webSocketId);
    OfflineReport searchOfflineReport(String userId);
}
