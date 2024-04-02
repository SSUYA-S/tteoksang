package com.welcome.tteoksang.game.dto.user;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
// 내가 가지고 있는 농산물 정보
public class UserProductInfo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer productQuantity;    // 현재 보유량
    private Integer productPurchaseQuantity;    // 구매한 개수
    private Long productTotalCost;   // 농산물 총 구매 금액
}
