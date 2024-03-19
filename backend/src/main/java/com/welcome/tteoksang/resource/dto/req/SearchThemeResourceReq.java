package com.welcome.tteoksang.resource.dto.req;

import com.welcome.tteoksang.resource.dto.Theme;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchThemeResourceReq {
    List<Theme> themeList;
}
