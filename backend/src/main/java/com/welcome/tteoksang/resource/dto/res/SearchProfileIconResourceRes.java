package com.welcome.tteoksang.resource.dto.res;

import com.welcome.tteoksang.resource.dto.ProfileIcon;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchProfileIconResourceRes {
    List<ProfileIcon> profileIconList;
}
