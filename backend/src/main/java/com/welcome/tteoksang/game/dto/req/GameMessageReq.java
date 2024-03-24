package com.welcome.tteoksang.game.dto.req;

import com.welcome.tteoksang.resource.type.MessageType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameMessageReq {
    MessageType type;
    Object body;
}
