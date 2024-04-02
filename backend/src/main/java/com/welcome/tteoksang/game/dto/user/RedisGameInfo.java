package com.welcome.tteoksang.game.dto.user;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.welcome.tteoksang.game.dto.user.UserProductInfo;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RedisGameInfo implements Serializable {

    private Integer gameId;
    private Long gold;
    private Long lastQuarterGold;
    private Integer warehouseLevel;
    private Integer vehicleLevel;
    private Integer brokerLevel;
    private String privateEventId;
    private Integer lastPlayTurn;

    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime lastConnectTime;
    private Integer purchaseQuantity;
    private Integer totalProductQuantity;
    private Map<Integer, UserProductInfo> products;    // 사용시 역직렬화
    private Long rentFee;
}
