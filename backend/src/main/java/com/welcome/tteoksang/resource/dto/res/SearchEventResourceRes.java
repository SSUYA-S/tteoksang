package com.welcome.tteoksang.resource.dto.res;

import com.welcome.tteoksang.resource.dto.Event;
import com.welcome.tteoksang.resource.dto.EventResource;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchEventResourceRes {
    List<Event> eventList;
}
