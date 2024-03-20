package com.welcome.tteoksang.resource.dto;

import com.welcome.tteoksang.resource.type.RewardType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Achievement  implements Serializable {
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

    @Enumerated(EnumType.STRING)
    @Column(name = "achievement_reward_type") //columnDefinition = "enum ('NONE','TITLE', 'ICON','FRAME','THEME')"
    RewardType achievementRewardType;
    @Column(name="achievement_reward_id")
    Integer achievementRewardId;
}
