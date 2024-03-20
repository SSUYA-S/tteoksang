package com.welcome.tteoksang.resource.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
public class Event implements Serializable {
    Integer eventId;
    String eventName;
    String eventType;
    String eventContent;
    String eventDescription;
    Integer eventEffectValue;;
    String eventUnit;
}
