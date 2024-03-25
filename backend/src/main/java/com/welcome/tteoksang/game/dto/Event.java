package com.welcome.tteoksang.game.dto;

import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    String id;
    String eventName;
    String eventContent;
    String eventType; //SPECIAL / PRIVATE / SPRING / SUMMER / FALL / WINTER
    List<ProductVariance> eventVariance;
    String eventHeadline;
    String privateEventType; //bonus(보유자금 관련), discount(업그레이드 관련), product(보유항목 관련)
    String privateEventTarget;
    Integer privateEventBonus;

}
