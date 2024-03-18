package com.welcome.tteoksang.resource.dto.req;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchievementResource {
    Integer achievementId;
    String achievementName;
    String achievementDescription;
    Integer achievementGoal;
    String achievementGoalDescription;
}
