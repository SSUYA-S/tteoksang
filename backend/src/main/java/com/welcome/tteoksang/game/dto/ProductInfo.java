package com.welcome.tteoksang.game.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// 서버에 저장되어 있는 농산물 정보
public class ProductInfo {
    private Integer productId;
    private Integer productCost;
    private Integer productMaxQuantity;
    private Integer productFluctuation;
}
