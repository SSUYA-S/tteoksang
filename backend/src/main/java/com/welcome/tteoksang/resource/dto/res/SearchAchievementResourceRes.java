package com.welcome.tteoksang.resource.dto.res;

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
