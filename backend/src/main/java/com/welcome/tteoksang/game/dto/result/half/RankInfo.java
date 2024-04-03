package com.welcome.tteoksang.game.dto.result.half;

import com.welcome.tteoksang.user.dto.UserInfo;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RankInfo {
    private String rankName;
    private String rankDescription;
    private TheFirstUserInfo theFirstUserInfo;
    private Long theFirstRecord;
    private Integer myRank;
    private Long myRecord;
}
