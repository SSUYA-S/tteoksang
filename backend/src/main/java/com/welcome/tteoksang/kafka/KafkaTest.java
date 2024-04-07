package com.welcome.tteoksang.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.game.dto.result.*;
import com.welcome.tteoksang.game.dto.result.half.BestSellerStatistics;
import com.welcome.tteoksang.game.dto.result.half.TteokValues;
import com.welcome.tteoksang.game.dto.result.half.TteokrockStatistics;
import com.welcome.tteoksang.game.dto.result.half.TteoksangStatistics;
import com.welcome.tteoksang.game.dto.server.RedisHalfStatistics;
import com.welcome.tteoksang.game.dto.server.RedisStatisticsUtil;
import com.welcome.tteoksang.game.dto.user.RedisGameInfo;
import com.welcome.tteoksang.game.scheduler.ServerInfo;
import com.welcome.tteoksang.game.service.SeasonHalfPrivateStatisticsService;
import com.welcome.tteoksang.game.service.SeasonHalfStatisticsService;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.StringTokenizer;
import java.util.stream.Collectors;

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

    private final Rank rank;
    private final SeasonHalfPrivateStatisticsService seasonHalfPrivateStatisticsService;
    private final SeasonHalfStatisticsService seasonHalfStatisticsService;
    private final RedisService redisService;
    private final RedisStatisticsUtil redisStatisticsUtil;
    private final ServerInfo serverInfo;
    private final SeasonHalfStatistics seasonHalfStatistics = new SeasonHalfStatistics();

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
    @KafkaListener(topics = "tteoksang_hadoop", containerFactory = "kafkaListenerContainerFactory")
    public void receiveHadoopDataResult(ConsumerRecord<String, String> consumerRecord) {

        String id = consumerRecord.key();   //userId::gameId 형태로 들어옴
        String value = consumerRecord.value();  // 통계값

        // 랭킹
        List<Sellerbrity> sellerbrityRank = rank.getSellerbrityRank();
        List<Millionaire> millionaireRank = rank.getMillionaireRank();
        List<Tteoksang> tteoksangRank = rank.getTteoksangRank();

        if(!value.equals("END")) {
            // 레디스 불러오기
            String redisGameInfoKey = RedisPrefix.INGAMEINFO.prefix() + id;
            RedisGameInfo redisGameInfo = (RedisGameInfo) redisService.getValues(redisGameInfoKey);

            // 몽고디비에 저장
            ObjectMapper mapper = new ObjectMapper();
            try {
                // 객체로 변환
                // id 가공
                String[] parts = id.split("::");
                log.debug("하둡에서 온 ID:{}", id);
                String mongoKey = serverInfo.getSeasonId() + "," + serverInfo.getCurrentTurn()/180
                        + "," + parts[0] + "," + parts[1];
                log.debug("몽고디비 ID:{}", mongoKey);
                SeasonHalfPrivateStatistics mongoData = mapper.readValue(value, SeasonHalfPrivateStatistics.class);
                mongoData.setId(mongoKey);
                log.debug("몽고디비 Value:{}", mongoData)
                ;
                // 객체 넣기
                sellerbrityRank.add(new Sellerbrity(id, mongoData.getTotalAccPrivateProductProfit()));
                millionaireRank.add(new Millionaire(id, redisGameInfo.getGold()));
                tteoksangRank.add(new Tteoksang(id, redisGameInfo.getGold() - redisGameInfo.getLastQuarterGold()));

                // 몽고디비에 저장
                SeasonHalfPrivateStatistics privateStatistics = seasonHalfPrivateStatisticsService.saveSeasonHalfPrivateStatistics(mongoData);

                // 서버에 누적
                seasonHalfStatistics.accumulateTotalAccRentFee(privateStatistics.getAccPrivateRentFee());
                seasonHalfStatistics.accumulateAccBrokerFee(privateStatistics.getTotalAccPrivateBrokerFee());
                seasonHalfStatistics.accumulateAccGamePlayCount(Integer.parseInt(parts[1]));
                seasonHalfStatistics.accumulateAccGiveUpCount(privateStatistics.getAccPrivateGiveUpCount());
                seasonHalfStatistics.accumulateAccOnlineTimeSlotCount(privateStatistics
                        .getAccPrivateOnlineTimeSlotCount());
                seasonHalfStatistics.findMaxRentFee(privateStatistics.getMaxPrivateRentFee());
                seasonHalfStatistics.updateProductStatics(privateStatistics.getProductStatistics());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        else {
            // 떡상 추가
            seasonHalfStatistics.setTteoksangStatistics(TteoksangStatistics.builder().values(getTteoksangStatistics()).build());
            // 떡락 추가
            seasonHalfStatistics.setTteokrockStatistics(TteokrockStatistics.builder().values(getTteokrockStatistics()).build());
            // 베스트 셀러
            seasonHalfStatistics.findBestSeller();

            // end이면 서버 통계 집계후 몽고디비에 저장
            seasonHalfStatisticsService.saveSeasonHalfStatistics(seasonHalfStatistics);

            // 랭킹 집계
            Collections.sort(sellerbrityRank);
            Collections.sort(millionaireRank);
            Collections.sort(tteoksangRank);
        }
    }
}
