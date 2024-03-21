package com.welcome.tteoksang.user.dto.res;

import com.welcome.tteoksang.user.dto.AchieveInfo;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchAchieveRes {

    private List<AchieveInfo> acquiredAchievementList;

}
