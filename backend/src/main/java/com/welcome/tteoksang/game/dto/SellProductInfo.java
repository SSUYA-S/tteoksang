package com.welcome.tteoksang.game.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// 판매의 response 에 들어가는 body 객체
public class SellProductInfo {
    private Long gold;
    private List<ProductTradeInfo> productList; // 유저가 가지고 있는 농산물 정보
}
