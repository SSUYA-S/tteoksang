package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.event.BreakTimeInfo;
import com.welcome.tteoksang.game.dto.event.NewsInfo;

public interface PrivateGetPublicService {
    NewsInfo searchNewspaper();

    BreakTimeInfo searchBreakTime();
}
