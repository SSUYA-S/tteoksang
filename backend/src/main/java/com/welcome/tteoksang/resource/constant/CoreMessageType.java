package com.welcome.tteoksang.resource.constant;

//REQ, RES 제외 메세지 타입 구분만 있는 ENUM
public enum CoreMessageType {

    CHANGE_TITLE(3),
    BUY_PRODUCT(1),
    SELL_PRODUCT(2),
    UPGRADE_WAREHOUSE,
    UPGRADE_BROKER,
    UPGRADE_VEHICLE,
    QUIT_GAME,
    GIVEUP_GAME,
    GET_INTIME_TIME,
    GET_PUBLIC_EVENT, //
    GET_PRIVATE_EVENT,
    GET_MY_GOLD,
    GET_INFRA_LEVEL,
    GET_WAREHOUSE_INFO,
    GET_TOTAL_INFO,
    ALERT_PLAYTIME, //
    GET_NEWSPAPER,
    SEND_CHAT,
    GET_QUARTER_REPORT,
    GET_HALF_REPORT,
    GET_FINAL_REPORT,
    GET_OFFLINE_REPORT;

    private int code;
    CoreMessageType(int code){
        this.code=code;
    }
    CoreMessageType(){
        this.code=-1;
    }

    public int getCode(){
        return this.code;
    }
    }
