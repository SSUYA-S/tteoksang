package com.welcome.tteoksang.game.dto.result;

import java.util.List;

public class RentFeeInfo {
    private String billType;
    private Long rentFee;
    // 판매된 농산물 정보
    private List<OverdueProduct> productList;
}
