package com.welcome.tteoksang.resource.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class EventResource  implements Serializable {
    String eventId;
    String eventName;
    String eventType;
    String eventDescription;
    Integer eventEffectValue;;
    String eventUnit;
}
