package com.welcome.tteoksang.user.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class AchieveId implements Serializable {

    private String userId;
    private Integer achievementId;
}
