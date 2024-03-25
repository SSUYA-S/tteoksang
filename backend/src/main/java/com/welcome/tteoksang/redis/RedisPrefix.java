package com.welcome.tteoksang.redis;

public enum RedisPrefix {
    REFRESH_TOKEN("loginRefresh:"),
    REGIST("regist:"),
    CHANGE_EMAIL("changeEmail:"),
    RESET_PASSOWRD("resetPassword:"),
    ENCODING("encoding:"),
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
