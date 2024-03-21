package com.welcome.tteoksang.resource.dto.res;

import com.welcome.tteoksang.resource.dto.AchievementResource;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchAchievementResourceRes {
    List<AchievementResource> achievementList;
}
