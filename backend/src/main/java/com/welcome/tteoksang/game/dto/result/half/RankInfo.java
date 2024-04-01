package com.welcome.tteoksang.game.dto.result.half;

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
    private Integer theFirstRecord;
    private Integer myRank;
    private Long myRecord;
}
