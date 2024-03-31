package com.welcome.tteoksang.game.dto.event;

import com.welcome.tteoksang.game.dto.ProductInfo;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicEventInfo {
    LocalDateTime inGameTime;
    LocalDateTime turnStartTime;
    Integer turn;
    List<ProductInfo> productInfoList;
    List<Integer> buyableProductList;
    List<String> specialEventId;

    @Override
    public String toString() {
        return turnStartTime+" "+specialEventId.toString();
    }
}
