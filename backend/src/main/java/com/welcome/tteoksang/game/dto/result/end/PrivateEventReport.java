package com.welcome.tteoksang.game.dto.result.end;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrivateEventReport {
    private Integer year;
    private List<PrivateEvent> privateEventList;
}
