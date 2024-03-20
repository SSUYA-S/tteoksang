
package com.welcome.tteoksang.resource.dto.res;

import com.welcome.tteoksang.resource.dto.ProfileFrame;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchProfileFrameResourceRes {
    List<ProfileFrame> profileFrameList;
}
