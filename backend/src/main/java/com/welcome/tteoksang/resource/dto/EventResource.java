package com.welcome.tteoksang.resource.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResource  implements Serializable {
    Integer eventId;
    String eventName;
    String eventType;
    String eventDescription;
    Integer eventEffectValue;;
    String eventUnit;
}
