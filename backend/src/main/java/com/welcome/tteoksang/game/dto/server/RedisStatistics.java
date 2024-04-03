package com.welcome.tteoksang.game.dto.server;

import lombok.*;

import java.io.Serializable;
import java.util.Map;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RedisStatistics implements Serializable {
    Map<String,Integer> eventCountMap;
    Map<Integer,CostRateStatistics> productCostRateMap;
}
