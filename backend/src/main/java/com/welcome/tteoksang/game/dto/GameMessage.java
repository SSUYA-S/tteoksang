package com.welcome.tteoksang.game.dto;

import com.welcome.tteoksang.resource.type.MessageType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameMessage {
    MessageType type;
    Object body;
}
