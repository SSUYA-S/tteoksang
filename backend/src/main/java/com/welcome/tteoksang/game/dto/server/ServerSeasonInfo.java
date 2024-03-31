package com.welcome.tteoksang.game.dto.server;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

@Entity(name = "_server_season_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServerSeasonInfo {
    @Id
    Integer seasonId;

    LocalDateTime startedAt;
}
