package com.welcome.data.kafka;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@Getter
@Setter
public class LogConsumer {

    private int count = 0;
    private int fileCount = 0;
    private StringBuilder data = new StringBuilder();
    private int seasonId = -1;
    private int halfSeasonId = 1;

    @Value("${LOG_PATH}")
    private String logPath;

    @KafkaListener(id = "logger", topics = "${KAFKA_TOPIC_LOG}", containerFactory = "kafkaListenerContainerFactory")
    public void listener(@Payload String logData) {
        count += 1;
        data.append(logData).append("\n");
        log.info(logData);

        if(count > 1000) {
            flush();
        }
    }

    public void flush() {
        String filePath = String.format("%s/%d/%d/%d.txt", logPath, seasonId, halfSeasonId, fileCount);
        Path path = Paths.get(filePath);
        try {
            if(!Files.exists(path.getParent())) {
                Files.createDirectories(path.getParent());
            }
        } catch (Exception e) {
            log.error("err: {}", e);
            return;
        }

        try(BufferedWriter bw = new BufferedWriter(new FileWriter(filePath));) {
            bw.write(data.toString());
            bw.flush();
            count = 0;
            fileCount += 1;
            data = new StringBuilder();
        } catch(Exception e) {
            log.error("err: {}", e);
        }
    }
}
