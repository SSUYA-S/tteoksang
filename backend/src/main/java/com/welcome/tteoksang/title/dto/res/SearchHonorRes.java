package com.welcome.tteoksang.title.dto.res;

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
