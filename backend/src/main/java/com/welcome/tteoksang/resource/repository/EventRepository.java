package com.welcome.tteoksang.resource.repository;

import com.welcome.tteoksang.resource.dto.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {
    @Query("{$or :[{eventType: ?0},{eventType: SPECIAL}]}")
    List<Event> findEventsOccurInSpecificSeason(String seasonName);
}
