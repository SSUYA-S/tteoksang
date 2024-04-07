package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.resource.dto.Event;
import com.welcome.tteoksang.resource.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class DemoServiceImpl {
    private final EventRepository eventRepository;
    private List<Event> currentEventList; //현재 적용 중 이벤트

    public void initDemo(){
        currentEventList=new ArrayList<>();
        List<Event> allEvent=eventRepository.findAll(Sort.by(Sort.Direction.ASC, "eventType"));
        currentEventList.add(allEvent.get(343-1));
        currentEventList.add(allEvent.get(361-1));
        currentEventList.add(allEvent.get(386-1));
        currentEventList.add(allEvent.get(204-1));

        currentEventList.stream().forEach(
                x->log.debug(x.getEventType()+"/"+x.getEventName()+" :"+x.toString())

        );
//        log.debug(currentEventList.toString());
    }

}
