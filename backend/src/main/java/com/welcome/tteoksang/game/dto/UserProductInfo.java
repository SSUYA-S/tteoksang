package com.welcome.tteoksang.game.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// 내가 가지고 있는 농산물 정보
public class UserProductInfo {
    private Integer productId;
    private Integer productCount;
    private Integer TotalCost;
}
