package com.welcome.tteoksang.game.dto.result.half;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TteoksangStatistics {
    private List<TteokValues> values;
}
