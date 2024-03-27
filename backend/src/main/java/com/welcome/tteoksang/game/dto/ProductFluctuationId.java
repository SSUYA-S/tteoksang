package com.welcome.tteoksang.game.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductFluctuationId implements Serializable {

    Integer countPerTenDays;
    Integer productId;

}
