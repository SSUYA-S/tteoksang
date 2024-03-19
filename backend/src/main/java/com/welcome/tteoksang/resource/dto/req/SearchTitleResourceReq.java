package com.welcome.tteoksang.resource.dto.req;

import com.welcome.tteoksang.resource.dto.Title;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchTitleResourceReq {
    List<Title> titleList;
}
