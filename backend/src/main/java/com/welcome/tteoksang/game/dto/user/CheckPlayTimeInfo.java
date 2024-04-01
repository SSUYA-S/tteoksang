package com.welcome.tteoksang.game.dto.user;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class CheckPlayTimeInfo {
    @JsonDeserialize
    LocalDateTime checked;
    Integer alertCount;
}
