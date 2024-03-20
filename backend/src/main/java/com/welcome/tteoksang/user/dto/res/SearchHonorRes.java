package com.welcome.tteoksang.user.dto.res;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchHonorRes {

    private List<Integer> acquiredTitleList;

}
