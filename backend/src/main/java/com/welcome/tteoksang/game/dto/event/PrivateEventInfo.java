package com.welcome.tteoksang.game.dto.event;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrivateEventInfo {
    private Long gold;
    private String privateEventId;
}
