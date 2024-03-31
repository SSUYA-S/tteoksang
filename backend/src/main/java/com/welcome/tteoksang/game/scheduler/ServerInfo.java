package com.welcome.tteoksang.game.scheduler;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.welcome.tteoksang.game.dto.ServerProductInfo;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ServerInfo {
    public static int currentTurn = 1;
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    public static LocalDateTime turnStartTime = LocalDateTime.now();
    public static String specialEventId;

    private int seasonId;
    private Map<Integer, ServerProductInfo> productInfoMap;
    private List<Integer> buyableProducts;
}
