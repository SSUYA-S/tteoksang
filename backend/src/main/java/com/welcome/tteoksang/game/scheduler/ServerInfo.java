package com.welcome.tteoksang.game.scheduler;

import java.time.LocalDateTime;

public class ServerInfo {
    public static int currentTurn = 1;
    public static LocalDateTime turnStartTime = LocalDateTime.now();
    public static String specialEventId;
}
