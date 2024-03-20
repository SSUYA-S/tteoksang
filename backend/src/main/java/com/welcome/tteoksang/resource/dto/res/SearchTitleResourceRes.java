package com.welcome.tteoksang.resource.dto.res;

import com.welcome.tteoksang.resource.dto.Title;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchTitleResourceRes {
    List<Title> titleList;
}
