package com.welcome.tteoksang.resource.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class EventResource  implements Serializable { //TODO - 필요없으면 지우기
    String eventId;
    String eventName;
    String eventType;
    String eventContent;
    String eventHeadline;
    Double eventVariance;
    Integer productId;
}
