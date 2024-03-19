package com.welcome.tteoksang.resource.dto.req;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchMessageTypeResource {
    List<MessageTypeResource> messageTypeList;
}
