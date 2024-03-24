package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.Article;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class PublicServiceImpl implements PublicService {

    private String publicEventId;
    private List<String> nextEvent;

    private List<Article> newspaper=new ArrayList<>();


    @Override
    public List<Article> createNewspaper() {
        //n개 이벤트 바탕으로 뉴스페이퍼 만들기
//        nextEvent 바탕으로 newspaper에 저장
        return newspaper;
    }

    @Override
    public List<Article> searchNewspaper() {
        return newspaper;
    }

    @Override
    public Object searchPublicEvent() {

        return publicEventId;
    }

    @Override
    public void selectNextEvent() {
        //현재 계절+all 이벤트 데려와서 n개 뽑기-> nextEvent에 저장
        nextEvent.add(null);
    }

    @Override
    public void applyEvent() {
        //이벤트 후보 중 하나 선택
        //선택한 것 기준으로 가격 변동 영향 저장


    }
}
