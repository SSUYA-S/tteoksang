package com.welcome.tteoksang.resource.dto;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Document(collection = "event")
public class Event {
    @Id
    String eventId;
    @Field(name = "eventName")
    String eventName;
    @Field(name = "eventType")
    String eventType;//SPECIAL / PRIVATE / SPRING / SUMMER / FALL / WINTER
    @Field(name = "eventContent")
    String eventContent;

    @Field(name = "eventVariance")
    List<ProductVariance> eventVariance;

    @Field(name = "eventHeadline")
    String eventHeadline;

    @Field(name = "privateEventType")
    String privateEventType;//bonus(보유자금 관련), discount(업그레이드 관련), product(보유항목 관련)
    @Field(name = "privateEventTarget")
    String privateEventTarget;
    @Field(name = "privateEventBonus")
    Integer privateEventBonus;
}
