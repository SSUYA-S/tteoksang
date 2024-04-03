package com.welcome.data.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.MessageListenerContainer;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaManager {

    private final KafkaListenerEndpointRegistry registry;

    @Bean
    public ApplicationRunner runner(KafkaListenerEndpointRegistry registry,
        KafkaTemplate<String, String> template) {
        return args -> {
            registry.getListenerContainers().forEach(MessageListenerContainer::pause);
        };
    }

    public void pauseAll() {
        registry.getListenerContainers().forEach(MessageListenerContainer::pause);
    }

    public void resumeAll() {
        registry.getListenerContainers().forEach(MessageListenerContainer::resume);
    }

}
