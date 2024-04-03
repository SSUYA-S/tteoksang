package com.welcome.tteoksang.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.game.dto.result.SeasonHalfPrivateStatistics;
import com.welcome.tteoksang.game.dto.result.SeasonHalfStatistics;
import com.welcome.tteoksang.game.dto.result.half.TteokValues;
import com.welcome.tteoksang.game.dto.server.RedisHalfStatistics;
import com.welcome.tteoksang.game.dto.server.RedisStatisticsUtil;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

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

    private final RedisService redisService;
    private final RedisStatisticsUtil redisStatisticsUtil;
    //tteoksang_log
    //tteoksang_hadoop
    @KafkaListener(topics = "${KAFKA_TOPIC_LOG}", containerFactory = "kafkaListenerContainerFactory")
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

    public List<TteokValues> getTteoksangStatistics() {
        RedisHalfStatistics redisHalfStatistics = (RedisHalfStatistics) redisService.getValues(RedisPrefix.SERVER_HALF_STATISTICS.prefix());
        List<TteokValues> tteokValuesList = redisHalfStatistics.getProductCostRateMap().entrySet().stream().map(entry ->
                TteokValues.builder()
                        .productId(entry.getKey())
                        .value(redisStatisticsUtil.getTteoksang(entry.getValue()))
                        .build()
        ).collect(Collectors.toList());
        tteokValuesList.sort(Collections.reverseOrder());
        return tteokValuesList;
    }

    public List<TteokValues> getTteokrockStatistics() {
        RedisHalfStatistics redisHalfStatistics = (RedisHalfStatistics) redisService.getValues(RedisPrefix.SERVER_HALF_STATISTICS.prefix());
        List<TteokValues> tteokValuesList = redisHalfStatistics.getProductCostRateMap().entrySet().stream().map(entry ->
                TteokValues.builder()
                        .productId(entry.getKey())
                        .value(redisStatisticsUtil.getTteokrock(entry.getValue()))
                        .build()
        ).collect(Collectors.toList());
        Collections.sort(tteokValuesList);
        return tteokValuesList;
    }

    // 여기서 하둡에서 보낸 데이터를 받아서 몽고 디비로 넣음
    @KafkaListener(topics = "tteoksang_hadoop", containerFactory = "kafkaListenerContainFactory")
    public void receiveHadoopDataResult(@Payload String hadoopData) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            SeasonHalfPrivateStatistics message = mapper.readValue(hadoopData, SeasonHalfPrivateStatistics.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        log.debug("Kafka: {}", hadoopData);
    }
}
