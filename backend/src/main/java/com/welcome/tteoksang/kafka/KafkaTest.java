package com.welcome.tteoksang.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

/**
 * String 형태의 json을 보낸다
 * {
 * "type": "BUY",
 * "body": {
 * "userId" : "asdffw-qwerqw",
 * "gameId": 1,
 * "turn": 12,
 * "productId": 8,
 * "purchasedQuantity": 12,
 * "productOutcome": 123,
 * "productQuantity": 11,
 * "productCost": 130
 * }
 * }
 * <p>
 * 제대로 된 형식이 들어왔는지 확인하기 위해 jackson으로 객체 형태로 만들고 다시 로그를 찍는다.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class KafkaTest {
    @Value("${KAFKA_TOPIC_LOG}")
    String testTopicName;

    @KafkaListener(topics = "tteoksang_log", containerFactory = "kafkaListenerContainerFactory")
    public void receiveLogDataResult(@Payload String logData) {

        ObjectMapper mapper = new ObjectMapper();
        try {
            Message message = mapper.readValue(logData, Message.class);
            log.debug("Type: {}", message.getType());
        } catch (Exception e) {
            e.printStackTrace();
        }
        log.debug("Kafka: {}", logData);
    }
}
