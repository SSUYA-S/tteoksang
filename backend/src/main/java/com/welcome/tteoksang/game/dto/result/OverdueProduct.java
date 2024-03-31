package com.welcome.tteoksang.game.dto.result;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OverdueProduct {
    private Integer productId;
    private Integer productQuantity;
}
