package com.welcome.tteoksang.game.dto.server;

import lombok.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
@ToString
public class CostRateStatistics implements Serializable {
    private List<CostInfo> maxCostList;
    private List<CostInfo> minCostList;
    private int maxLastIndex, minLastIndex;

    private CostRateStatistics() {
        maxCostList = new ArrayList<>();
        minCostList = new ArrayList<>();
    }
//
    public CostRateStatistics(Integer defaultCost, int initialTurn) {
        this();
        maxCostList.add(new CostInfo(defaultCost, initialTurn));
        minCostList.add(new CostInfo(defaultCost, initialTurn));
        maxLastIndex = 0;
        minLastIndex = 0;
    }

}
