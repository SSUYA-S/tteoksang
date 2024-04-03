package com.welcome.tteoksang.redis;

public enum RedisPrefix {
    REFRESH_TOKEN("loginRefresh:"),
    REGIST("regist:"),
    CHANGE_EMAIL("changeEmail:"),
    SERVER_STATISTICS("serverStatistics"),
    SERVER_HALF_STATISTICS("serverHalfStatistics"),
    SERVER_INFO("serverInfo"),
    SERVER_NEWS("serverNews"),
    SERVER_BREAK("serverBreak"),
    USERINFO("userInfo:"),
    WEBSOCKET("webSocket:"),
    INGAMEINFO("inGameInfo:");



    private String prefix;

    RedisPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String prefix() {
        return prefix;
    }
}
