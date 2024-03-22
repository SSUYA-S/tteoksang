package com.welcome.tteoksang.game.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chat {
    String userNickname;
    String message;
    Integer profileIconId;
    Integer profileFrameId;
}
