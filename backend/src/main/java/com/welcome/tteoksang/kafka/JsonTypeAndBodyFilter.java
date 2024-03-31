package com.welcome.tteoksang.kafka;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.filter.Filter;
import ch.qos.logback.core.spi.FilterReply;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonTypeAndBodyFilter extends Filter<ILoggingEvent> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public FilterReply decide(ILoggingEvent event) {
        String message = event.getFormattedMessage();
        try {
            JsonNode jsonNode = objectMapper.readTree(message);
            // `type`과 `body` 필드가 모두 존재하는지 확인
            if (jsonNode.has("type") && jsonNode.has("body")) {
//                String typeValue = jsonNode.get("type").asText(); // `type` 필드의 값 추출
//                System.out.println("Log Type: " + typeValue); // 콘솔에 출력
                return FilterReply.ACCEPT;
            }
        } catch (Exception e) {
            // JSON 파싱 실패 또는 기타 오류 처리
            // 필터링하지 않음 (또는 필요에 따라 다른 처리)
        }
        return FilterReply.DENY; // 조건에 맞지 않으면 로그를 전송하지 않음
    }
}
