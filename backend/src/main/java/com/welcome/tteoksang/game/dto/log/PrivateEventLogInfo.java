package com.welcome.tteoksang.game.dto.log;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrivateEventLogInfo {
    private Integer seasonId;
    private String userId;
    private Integer gameId;
    private Integer turn;
    private String eventId;
    private String eventType;
    private Integer eventBonus;
}
