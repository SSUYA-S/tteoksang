package com.welcome.tteoksang.game.dto.result.end;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialEventReport {
    private Integer year;
    private List<SpecialEvent> specialEventList;
}
