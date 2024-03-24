package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.Article;

import java.util.List;

public interface PublicService {
//    신문 발행
    List<Article> createNewspaper();

    List<Article> searchNewspaper();

//    공통 이벤트 조회
    //TODO - 반환 값 설정
    Object searchPublicEvent();

    //다음 이벤트 발생
    void selectNextEvent();

    //이벤트 적용 -> 가격 변동 영향 주기
    void applyEvent();
}
