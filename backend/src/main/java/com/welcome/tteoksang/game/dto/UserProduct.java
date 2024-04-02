package com.welcome.tteoksang.game.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// 서버에 저장되어 있는 농산물 정보
public class UserProduct {
    private Integer productId;
    private Integer productQuantity;    // 현재 보유량
    private Integer productPurchaseQuantity;    // 구매한 개수
    private Long productTotalCost;   // 농산물 총 구매 금액
}
