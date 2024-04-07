package com.welcome.tteoksang.game.dto.result.half;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BestSellerStatistics {
    private List<TteokValues> values = new ArrayList<>();
}
