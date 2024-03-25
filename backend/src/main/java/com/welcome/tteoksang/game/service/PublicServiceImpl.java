package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.Article;
import com.welcome.tteoksang.game.scheduler.ProductFlutuation;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
import com.welcome.tteoksang.game.scheduler.dto.PublicEventInfo;
import com.welcome.tteoksang.game.scheduler.dto.RedisProductInfo;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.resource.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class PublicServiceImpl implements PublicService {

    private final RedisService redisService;
    private final ProductRepository productRepository;
    //TODO- ProductFluctuationRepository 선언

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
    public PublicEventInfo searchPublicEvent() {

        return null;
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

    @Override
    public void fluctuateProduct() {
        List<RedisProductInfo> productInfoList= (List<RedisProductInfo>) redisService.getValues(RedisPrefix.PRODUCT_INFO.prefix());
        for(RedisProductInfo productInfo: productInfoList){
            // ServerInfo.currentTurn/10 && productId가 동일한 농산물의 flutuation 확인
            //fluctuation k배
            //random값 생성
            ProductFlutuation flutuation=new ProductFlutuation();
            Double range=flutuation.getMaxFluctuationRate()-flutuation.getMinFluctuationRate();
            Double value=Math.random()*range + flutuation.getMinFluctuationRate();
            long newCost= (long) (productInfo.getProductAvgCost()*value);
            productInfo.setProductFluctuation(newCost- productInfo.getProductCost());
            productInfo.setProductCost(newCost);
        }
    }

    @Override
    public void initProductInfo() {
        List<RedisProductInfo> productInfoList= (List<RedisProductInfo>) productRepository.findAll().stream().map(
                (product)-> {
                    return RedisProductInfo.builder()
                            .productId(product.getProductId())
                            .productCost(Long.valueOf(product.getProductDefaultCost()))
                            .productFluctuation(0L)
                            .productAvgCost(product.getProductAvgCost())
                            .productMaxQuantity(1000)
                            .build();
                }
        );
        redisService.setValues(RedisPrefix.PRODUCT_INFO.prefix(), productInfoList);
    }
}
