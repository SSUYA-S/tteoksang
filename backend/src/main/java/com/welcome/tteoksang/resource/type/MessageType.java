package com.welcome.tteoksang.resource.type;

public enum MessageType {
    CHANGE_TITLE(1),
    BUY_PRODUCT(2),
    SELL_PRODUCT(3),
    UPGRADE_WAREHOUSE(4),
    UPGRADE_BROKER(5),
    UPGRADE_VEHICLE(6),
    QUIT_GAME(7),
    GIVEUP_GAME(8),
    GET_INGAME_TIME(9),
    GET_PUBLIC_EVENT(10),
    GET_PRIVATE_EVENT(11),
    GET_MY_GOLD(12),
    GET_INFRA_LEVEL(13),
    GET_WAREHOUSE_INFO(14),
    GET_TOTAL_INFO(15),
    ALERT_PLAYTIME(16),
    GET_NEWSPAPER(17),
    CHAT(18),
    QUARTER_REPORT(19),
    HALF_REPORT(20),
    FINAL_REPORT(21),
    OFFLINE_REPORT(22);

    private int code;
    MessageType(int code){
        this.code=code;
    }

    public int getCode(){
        return this.code;
    }
}
