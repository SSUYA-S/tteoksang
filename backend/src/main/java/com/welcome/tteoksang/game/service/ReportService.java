package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.result.offline.OfflineReport;

public interface ReportService {
    void sendQuarterResult(String userId, String webSocketId);
    OfflineReport searchOfflineReport(String userId);
}
