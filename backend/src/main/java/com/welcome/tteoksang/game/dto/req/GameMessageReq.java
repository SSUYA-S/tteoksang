package com.welcome.tteoksang.game.dto.req;

import com.welcome.tteoksang.resource.type.MessageType;
import lombok.*;

import java.util.LinkedHashMap;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameMessageReq {
    MessageType type;
    LinkedHashMap<String, Object> body;
}
