package com.welcome.tteoksang.user.dto.res;

import com.welcome.tteoksang.user.dto.PreviousPlayInfo;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchPreviousPlayInfoRes {
    private Boolean isExist;
    private PreviousPlayInfo previousPlayInfo;
}
