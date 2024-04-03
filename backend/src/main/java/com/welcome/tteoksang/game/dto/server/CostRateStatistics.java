package com.welcome.tteoksang.game.dto.server;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class CostRateStatistics implements Serializable {
    private List<CostInfo> maxCostList;
    private List<CostInfo> minCostList;
    private int maxLastIndex, minLastIndex;

    private CostRateStatistics() {
        maxCostList = new ArrayList<>();
        minCostList = new ArrayList<>();
    }

    public CostRateStatistics(int defaultCost, int initialTurn) {
        this();
        maxCostList.add(new CostInfo(defaultCost, initialTurn));
        minCostList.add(new CostInfo(defaultCost, initialTurn));
        maxLastIndex = 0;
        minLastIndex = 0;
    }

    public void addCostInfo(CostInfo costInfo) {
        //가장 최신 턴의 최댓값, 최솟값
        CostInfo M = maxCostList.get(maxLastIndex);
        CostInfo m = minCostList.get(minLastIndex);
        if (M.getTurn() > m.getTurn()) {
            if (costInfo.getCost() > M.getCost()) {
                maxCostList.set(maxLastIndex, costInfo);
            } else if (costInfo.getCost() < m.getCost()
                    || maxLastIndex == 0
                    || maxCostList.get(maxLastIndex - 1).getCost() + costInfo.getCost() < M.getCost() + m.getCost()) {
                minCostList.add(costInfo);
                minLastIndex++;
            }

        } else if (M.getTurn() < m.getTurn()){
            if (costInfo.getCost() < m.getCost()) {
                minCostList.set(minLastIndex, costInfo);
            } else if (costInfo.getCost() > M.getCost()
                    || minLastIndex == 0
                    || minCostList.get(minLastIndex - 1).getCost() + costInfo.getCost() > M.getCost() + m.getCost()) {
                maxCostList.add(costInfo);
                maxLastIndex++;
            }
        } else { //맨 처음 값 업데이트
            if (costInfo.getCost() > M.getCost()) {
                maxCostList.set(maxLastIndex, costInfo);
            } else if (costInfo.getCost() < m.getCost()){
                minCostList.set(minLastIndex, costInfo);
            }
        }
    }

    public long getTteoksang(){
        int Mi=0,mi=0;
        if(maxCostList.get(0).getTurn()<minCostList.get(0).getTurn()){ // 하락꼴로 시작
            Mi=1;
        }  // 상승꼴로 시작
        long maxDifference=0;
        while(Mi<=maxLastIndex && mi<=minLastIndex){
            maxDifference=Math.max(maxDifference,maxCostList.get(Mi).getCost()-minCostList.get(mi).getCost());
            Mi++;
            mi++;
        }
        return maxDifference;
    }
    public long getTteokrock(){
        int Mi=0,mi=0;
        if(maxCostList.get(0).getTurn()>minCostList.get(0).getTurn()){ // 상승꼴로 시작
            mi=1;
        }  // 하락꼴로 시작
        long maxDifference=0;
        while(Mi<=maxLastIndex && mi<=minLastIndex){
            maxDifference=Math.max(maxDifference,maxCostList.get(Mi).getCost()-minCostList.get(mi).getCost());
            Mi++;
            mi++;
        }
        return -maxDifference;
    }
}
