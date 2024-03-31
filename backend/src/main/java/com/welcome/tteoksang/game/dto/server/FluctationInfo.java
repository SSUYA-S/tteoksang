package com.welcome.tteoksang.game.dto.server;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FluctationInfo {
    Double productAvgCost;
    Double maxFluctuationRate;
    Double minFluctuationRate;
    Double EventEffect;
}
