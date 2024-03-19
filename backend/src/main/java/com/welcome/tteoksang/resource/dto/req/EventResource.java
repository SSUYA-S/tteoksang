package com.welcome.tteoksang.resource.dto.req;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResource {
    Integer eventId;
    String eventName;
    String eventType;
    String eventDescription;
    Integer eventEffectValue;;
    String eventUnit;
}
