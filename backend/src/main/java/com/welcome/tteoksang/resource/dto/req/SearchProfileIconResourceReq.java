package com.welcome.tteoksang.resource.dto.req;

import com.welcome.tteoksang.resource.dto.ProfileIcon;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchProfileIconResourceReq {
    List<ProfileIcon> profileIconList;
}
