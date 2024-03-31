package com.welcome.tteoksang.game.dto.log;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialEventLogInfo {
    private Integer seasonId;
    private String eventId;
}
