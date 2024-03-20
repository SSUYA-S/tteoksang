package com.welcome.tteoksang.resource.dto.res;

import com.welcome.tteoksang.resource.dto.Theme;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchThemeResourceRes {
    List<Theme> themeList;
}
