package com.welcome.tteoksang.game.dto.result.quarter;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentFeeInfo {
    private String billType;
    private Long rentFee;
    // 판매된 농산물 정보
    private List<OverdueProduct> productList;
}
