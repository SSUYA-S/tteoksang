package com.welcome.tteoksang.game.dto.user;

import com.welcome.tteoksang.game.dto.ProductInfo;
import com.welcome.tteoksang.game.dto.UserProduct;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TotalInfo {
    private Long gold;
    private String privateEventId;
    private List<String> specialEventId;
    private String inGameTime;
    private String turnStartTime;
    private Integer turn;
    private Integer themeId;
    private List<UserProduct> productList; // 유저가 가지고 있는 농산물 정보
    private List<ProductInfo> productInfoList; // 서버 내 농산물 정보
    private List<Integer> buyAbleProductIdList;
    private Integer purchasedQuantity;
    private Integer warehouseLevel;
    private Integer vehicleLevel;
    private Integer brokerLevel;
}
