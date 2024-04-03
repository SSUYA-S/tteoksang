package com.welcome.tteoksang.game.dto.result;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventStatistics {
    private List<PrivateEventOccurCount> accPrivateEventOccurCount;
}
