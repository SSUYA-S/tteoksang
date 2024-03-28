package com.welcome.tteoksang.game.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// 내가 가지고 있는 농산물 정보
public class UserProductInfo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer productQuantity;
    private Integer productTotalCost;
}
