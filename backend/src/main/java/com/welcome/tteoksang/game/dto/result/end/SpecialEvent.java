package com.welcome.tteoksang.game.dto.result.end;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialEvent {
    private String specialEventName;
    private Integer totalAccSpecialEventOccurCount;
}
