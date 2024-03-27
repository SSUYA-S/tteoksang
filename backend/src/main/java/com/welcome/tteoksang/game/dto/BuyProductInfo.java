package com.welcome.tteoksang.game.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// 구매의 response 에 들어가는 body 객체
public class BuyProductInfo {
    private Long gold;
    private List<ProductTradeInfo> productList; // 유저가 가지고 있는 작물 정보
    private Integer purchasedQuantity;
}
