package com.welcome.tteoksang.game.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// 구매, 판매 response에서 사용되는 거래 농산물 정보 객체
public class ProductTradeInfo {
    private Integer productId;
    private Integer productQuantity;
    private Long productTotalCost;
}
