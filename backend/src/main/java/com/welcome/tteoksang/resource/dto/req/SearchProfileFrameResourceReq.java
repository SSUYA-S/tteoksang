
package com.welcome.tteoksang.resource.dto.req;

import com.welcome.tteoksang.resource.dto.ProfileFrame;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchProfileFrameResourceReq {
    List<ProfileFrame> profileFrameList;
}
