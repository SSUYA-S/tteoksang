package com.welcome.tteoksang.game.dto.res;

import com.welcome.tteoksang.resource.type.MessageType;
import jdk.jfr.Name;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameMessageRes {
    MessageType type;
    Boolean isSuccess;
    Object body;
}
