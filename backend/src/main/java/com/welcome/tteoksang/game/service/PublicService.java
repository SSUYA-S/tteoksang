package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.resource.type.MessageType;

public interface PublicService {
    //스케쥴 등록/삭제
    void initSeason();
    void startHalfYearGame();
    void endHalfYearGame();

    //실행
//  신문 발행
    void createNewspaper();
    void createEvent();
    void updateTurn();
    public void fluctuateProduct();
    void updateFluctuationInfo();
    void sendPublicMessage(MessageType type, Object body);
}
