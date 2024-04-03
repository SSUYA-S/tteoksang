package com.welcome.tteoksang.game.dto.result;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSlotCount {
    private Integer timeSlot;
    private Integer count;
}
