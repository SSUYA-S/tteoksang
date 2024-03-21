package com.welcome.tteoksang.game.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RedisGameInfo {

    private String userId;
    private Integer gameId;
    private Long gold;
    private Integer warehouseLevel;
    private Integer vehicleLevel;
    private Integer brokerLevel;
    private String privateEventId;
    private Integer lastPlayTurn;
    private LocalDateTime lastConnectTime;
    private Integer purchaseQuantity;
    private Map<Integer, Integer> products;    // 사용시 역직렬화
    private Long rentFee;
}
