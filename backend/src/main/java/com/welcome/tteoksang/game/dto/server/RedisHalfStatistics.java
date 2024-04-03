package com.welcome.tteoksang.game.dto.server;

import lombok.*;

import java.io.Serializable;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RedisHalfStatistics implements Serializable {

    Map<Integer,CostRateStatistics> productCostRateMap;
}
