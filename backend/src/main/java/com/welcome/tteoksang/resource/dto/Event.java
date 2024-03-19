package com.welcome.tteoksang.resource.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Event {
    Integer eventId;
    String eventName;
    String eventType;
    String eventContent;
    String eventDescription;
    Integer eventEffectValue;;
    String eventUnit;
}
