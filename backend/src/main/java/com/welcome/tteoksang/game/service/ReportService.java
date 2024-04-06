package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.res.GameMessageRes;
import com.welcome.tteoksang.game.dto.result.offline.OfflineReport;

public interface ReportService {
    GameMessageRes sendQuarterResult(String userId);
    GameMessageRes sendHalfResult(String userId);
    OfflineReport searchOfflineReport(String userId);
}
