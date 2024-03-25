package com.welcome.tteoksang.game.scheduler.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicEventInfo {
    LocalDateTime ingameTime;
    LocalDateTime turnStartTime;
    Integer turn;
    List<ProductInfo> productInfoList;
    List<Integer> buyableProductList;
    String specialEventId;

}
