package com.welcome.tteoksang.resource.dto.res;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchEventResourceRes {
    List<EventResource> eventList;
}
