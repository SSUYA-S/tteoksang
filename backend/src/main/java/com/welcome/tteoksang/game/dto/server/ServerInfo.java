package com.welcome.tteoksang.game.dto.server;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.welcome.tteoksang.game.dto.server.ServerProductInfo;
import lombok.*;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Component
public class ServerInfo {
    private int currentTurn = 1;
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime turnStartTime = LocalDateTime.now();
    private List<String> specialEventIdList;

    private int seasonId = 1;
    private Map<Integer, ServerProductInfo> productInfoMap;
    private List<Integer> buyableProducts;
}
