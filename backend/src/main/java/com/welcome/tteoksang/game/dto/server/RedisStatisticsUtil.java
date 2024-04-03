package com.welcome.tteoksang.game.dto.server;

import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class RedisStatisticsUtil {
    public void addCostInfo(CostRateStatistics costRateStatistics, CostInfo costInfo) {
        List<CostInfo> maxCostList=costRateStatistics.getMaxCostList();
        List<CostInfo> minCostList=costRateStatistics.getMinCostList();
        int maxLastIndex=costRateStatistics.getMaxLastIndex();
        int minLastIndex=costRateStatistics.getMinLastIndex();
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
                costRateStatistics.setMinLastIndex(minLastIndex+1);
            }
        } else if (M.getTurn() < m.getTurn()){
            if (costInfo.getCost() < m.getCost()) {
                minCostList.set(minLastIndex, costInfo);
            } else if (costInfo.getCost() > M.getCost()
                    || minLastIndex == 0
                    || minCostList.get(minLastIndex - 1).getCost() + costInfo.getCost() > M.getCost() + m.getCost()) {
                maxCostList.add(costInfo);
                costRateStatistics.setMaxLastIndex(maxLastIndex+1);
            }
        } else { //맨 처음 값 업데이트
            if (costInfo.getCost() > M.getCost()) {
                maxCostList.set(maxLastIndex, costInfo);
            } else if (costInfo.getCost() < m.getCost()){
                minCostList.set(minLastIndex, costInfo);
            }
        }
    }

    public void concatCostRateStatistics(CostRateStatistics target, CostRateStatistics from){
        target.getMaxCostList().addAll(from.getMaxCostList());
        target.getMinCostList().addAll(from.getMinCostList());
        target.setMaxLastIndex(target.getMaxCostList().size()-1);
        target.setMinLastIndex(target.getMinCostList().size()-1);
    }
    public CostRateStatistics makeCompact(CostRateStatistics costRateStatistics){
        List<CostInfo> maxCostList=costRateStatistics.getMaxCostList();
        List<CostInfo> minCostList=costRateStatistics.getMinCostList();
        int maxLastIndex=costRateStatistics.getMaxLastIndex();
        int minLastIndex=costRateStatistics.getMinLastIndex();

        Set<Integer> compactMaxCostIndex=new HashSet<>();
        Set<Integer> compactMinCostIndex=new HashSet<>();
        //Mi: maxList지칭 인덱스, mi: minList지칭 인덱스
        int Mi=0,mi=0;

        if(maxCostList.get(0).getTurn()<minCostList.get(0).getTurn()){ // 하락꼴로 시작 -> 상승꼴 맞추기
            Mi=1;
        }
        long maxDifference=0;
        //최대 차이를 내는 각 지칭 인덱스
        int sMi=Mi, smi=mi;
        //최대떡상확인
        while(Mi<=maxLastIndex && mi<=minLastIndex){
            long tmpDifference=maxCostList.get(Mi).getCost()-minCostList.get(mi).getCost();
            if(maxDifference<tmpDifference){
                maxDifference=tmpDifference;
                sMi=Mi;
                smi=mi;
            }
            Mi++;
            mi++;
        }
        compactMaxCostIndex.add(sMi);
        compactMinCostIndex.add(smi);


        Mi=0; mi=0;
        if(maxCostList.get(0).getTurn()>minCostList.get(0).getTurn()){ // 상승꼴로 시작 -> 하락꼴 맞추기
            mi=1;
        }
        int rMi=Mi, rmi=mi;
        maxDifference=0;
        //최대 떡락 확인
        while(Mi<=maxLastIndex && mi<=minLastIndex){
            long tmpDifference=maxCostList.get(Mi).getCost()-minCostList.get(mi).getCost();
            if(maxDifference<tmpDifference){
                maxDifference=tmpDifference;
                rMi=Mi;
                rmi=mi;
            }
            Mi++;
            mi++;
        }
        compactMaxCostIndex.add(rMi);
        compactMinCostIndex.add(rmi);
        //W꼴 확인
        if(compactMaxCostIndex.size()+compactMinCostIndex.size()==4){
            if(maxCostList.get(sMi).getTurn()<maxCostList.get(rMi).getTurn()){// /.\
                compactMinCostIndex.add(smi+1);
            } else{ // \`/
                compactMaxCostIndex.add(rMi+1);
            }
        }

        //다음 연결을 위한 가장 마지막턴 값 추가
        if(maxCostList.get(maxLastIndex).getTurn()<minCostList.get(minLastIndex).getTurn()){
            compactMinCostIndex.add(minLastIndex);
        }else{
            compactMaxCostIndex.add(maxLastIndex);
        }
        costRateStatistics.setMaxCostList(compactMaxCostIndex.stream().map(maxCostList::get).toList());
        costRateStatistics.setMinCostList(compactMinCostIndex.stream().map(minCostList::get).toList());
        costRateStatistics.setMinLastIndex(compactMinCostIndex.size()-1);
        costRateStatistics.setMaxLastIndex(compactMaxCostIndex.size()-1);

        return costRateStatistics;
    }

    public long getTteoksang(CostRateStatistics costRateStatistics){
        List<CostInfo> maxCostList=costRateStatistics.getMaxCostList();
        List<CostInfo> minCostList=costRateStatistics.getMinCostList();
        int maxLastIndex=costRateStatistics.getMaxLastIndex();
        int minLastIndex=costRateStatistics.getMinLastIndex();
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
    public long getTteokrock(CostRateStatistics costRateStatistics){
        List<CostInfo> maxCostList=costRateStatistics.getMaxCostList();
        List<CostInfo> minCostList=costRateStatistics.getMinCostList();
        int maxLastIndex=costRateStatistics.getMaxLastIndex();
        int minLastIndex=costRateStatistics.getMinLastIndex();
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
