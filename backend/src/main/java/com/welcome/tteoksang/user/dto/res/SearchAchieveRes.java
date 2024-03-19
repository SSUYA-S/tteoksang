package com.welcome.tteoksang.user.dto.res;

import com.welcome.tteoksang.user.dto.Achieve;
import com.welcome.tteoksang.user.dto.AchieveRes;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchAchieveRes {

    private List<AchieveRes> acquiredAchievementList;

}
