package com.welcome.tteoksang.resource.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Achievement {
    @Id
    @Column(name = "achievement_id")
    Integer achievementId;
    @Column(name = "achievement_name")
    String achievementName;
    @Column(name = "achievement_content")
    String achievementContent;

    @Column(name = "statistics_name")
    String statisticsName;
    @Column(name = "achievement_goal")
    Integer achievementGoal;

    @Column(name = "achievement_reward_type")
    String achievementRewardType;
    @Column(name="achievement_reward_id")
    Integer achievementRewardId;
}
