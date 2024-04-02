package com.welcome.tteoksang.game.dto.result.quarter;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quarter {
    private Integer turn;
    private RentFeeInfo rentFeeInfo;
    private Long quarterProfit;
    private Long rentFee;
    private List<Integer> inProductList;
    private Integer titleId;
}