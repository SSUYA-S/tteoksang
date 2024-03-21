package com.welcome.tteoksang.resource.dto.res;

import com.welcome.tteoksang.resource.dto.MessageTypeResource;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchMessageTypeResourceRes {
    List<MessageTypeResource> messageTypeList;
}
