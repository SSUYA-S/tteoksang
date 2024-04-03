package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.exception.FailToDataServerGetRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class RestTemplateService {
    RestTemplate restTemplate = new RestTemplate();

    @Value("${DATA_SERVER_URL}")
    private String dataServerUrl;

    public void getForEntity(String path){
        ResponseEntity<String> res = restTemplate.getForEntity(dataServerUrl +path, String.class);
        if(res.getStatusCode()== HttpStatus.BAD_REQUEST){
            throw new FailToDataServerGetRequestException();
        }
        log.debug(res.toString());
    }
    public void startHalfYearRequest(int seasonId, int halfId){
        log.debug("start.."+seasonId+", "+halfId);
//        getForEntity("/resources/checksum");
        getForEntity("/start/"+seasonId+"/"+halfId);
    }
    public void endHalfYearRequest(int seasonId, int halfId){
        log.debug("end.."+seasonId+", "+halfId);
//        getForEntity("/resources/checksum");
        getForEntity("/end/"+seasonId+"/"+halfId);
    }
}
