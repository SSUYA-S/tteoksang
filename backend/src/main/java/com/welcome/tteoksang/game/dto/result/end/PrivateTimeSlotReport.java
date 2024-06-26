package com.welcome.tteoksang.game.dto.result.end;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrivateTimeSlotReport {
    private Integer timeSlotIndex;
    private Integer privateTimeSlotCount;
}
