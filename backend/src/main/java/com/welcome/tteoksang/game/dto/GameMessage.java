package com.welcome.tteoksang.game.dto;

import com.welcome.tteoksang.resource.type.MessageType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class GameMessage {
    MessageType type;
    Object body;
}
