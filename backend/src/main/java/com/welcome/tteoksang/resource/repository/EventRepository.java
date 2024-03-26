package com.welcome.tteoksang.resource.repository;

import com.welcome.tteoksang.resource.dto.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event,String> {

    @Override
    List<Event> findAll();
}
