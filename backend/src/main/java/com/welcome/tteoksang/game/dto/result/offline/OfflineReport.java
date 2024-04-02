package com.welcome.tteoksang.game.dto.result.offline;

import com.welcome.tteoksang.game.dto.result.half.*;
import com.welcome.tteoksang.game.dto.result.quarter.Quarter;
import com.welcome.tteoksang.game.dto.result.quarter.RentFeeInfo;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfflineReport {
    private Integer lastGameTurn;
    private Long gold;
    private RentFeeInfo rentFeeInfo;
    private Quarter quarterReport;
    private Half halfReport;
    private Half recentHalfReport;
}
