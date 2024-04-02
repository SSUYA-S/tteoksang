package com.welcome.tteoksang.game.dto.result.offline;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuarterReport {
    private Long quarterProfit;
    private Long rentFee;
    private List<Integer> inProductList;
    private Integer titleId;
}
