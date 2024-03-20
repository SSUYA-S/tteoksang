package com.welcome.tteoksang.resource.dto.req;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchievementResource  implements Serializable {
    Integer achievementId;
    String achievementName;
    String achievementDescription;
    Integer achievementGoal;
    String achievementGoalDescription;
}
