package com.welcome.tteoksang.resource.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.welcome.tteoksang.resource.type.MessageType;
import com.welcome.tteoksang.resource.dto.*;
import com.welcome.tteoksang.resource.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.buf.HexUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ResourceServiceImpl implements ResourceService {

    private final AchievementRepository achievementRepository;
    private final BrokerRepository brokerRepository;
    private final EventRepository eventRepository;
    private final ProductRepository productRepository;
    private final ProfileFrameRepository profileFrameRepository;
    private final ProfileIconRepository profileIconRepository;
    private final ThemeRepository themeRepository;
    private final TitleRepository titleRepository;
    private final VehicleRepository vehicleRepository;
    private final WarehouseRepository warehouseRepository;
    private final ResourceChecksumRepository resourceChecksumRepository;

    @Override
    public List<AchievementResource> searchAchievementList() {
        List<AchievementResource> achievementResourceList = new ArrayList<>();
        for (Achievement achievement : achievementRepository.findAll()) {

            achievementResourceList.add(
                    AchievementResource.builder()
                            .achievementId(achievement.getAchievementId())
                            .achievementName(achievement.getAchievementName())
                            .achievementDescription(achievement.getAchievementContent())
                            .achievementGoalDescription(makeAchievementGoalDescription(achievement))
                            .build()
            );
        }

        return achievementResourceList;
    }

    // goalDescription에 따라 description 생성
    //TODO- statistics 형식에 따라 내용 변경
    // {대상통계량} {목표}({단위}) 달성 형식
    public String makeAchievementGoalDescription(Achievement achievement) {
        StringBuffer sb = new StringBuffer();
        sb.append(achievement.getStatisticsName()).append(" ")
                .append(achievement.getAchievementGoal()) //.append(단위) 있으면 좋을 듯
                .append(" 달성");
        return sb.toString();
    }

    @Override
    public List<Title> searchTitleList() {
        return titleRepository.findAll();
    }

    @Override
    public List<Theme> searchThemeList() {
        return themeRepository.findAll();
    }

    @Override
    public List<ProductResource> searchProductList() {
        List<ProductResource> productResourceList = new ArrayList<>();
        for (Product product : productRepository.findAll()) {
            productResourceList.add(
                    ProductResource.builder()
                            .productId(product.getProductId())
                            .productName(product.getProductName())
                            .productType(product.getProductType().name())
                            .productUnit(product.getProductUnit())
                            .build()
            );
        }

        return productResourceList;
    }

    //TODO - eventLIST 완성
    // - mongoDB에서 eventLIST 가져오기
    @Override
    public List<EventResource> searchEventList() {
        List<EventResource> eventResourceList = eventRepository.findAll().stream().map(
                (event) -> {
                    return EventResource.builder()
                            .eventId(event.getEventId())
                            .eventDescription(event.getEventContent())
                            .eventName(event.getEventName())
                            .eventType(event.getEventType())
                            .build();
                }
        ).toList();
        System.out.println(eventResourceList);
        return eventResourceList;
    }

    @Override
    public List<Warehouse> searchWarehouseList() {
        return warehouseRepository.findAll();
    }

    @Override
    public List<Vehicle> searchVehicleList() {
        return vehicleRepository.findAll();
    }

    @Override
    public List<Broker> searchBrokerList() {
        return brokerRepository.findAll();
    }

    @Override
    public List<ProfileIcon> searchProfileIconList() {
        return profileIconRepository.findAll();
    }

    @Override
    public List<ProfileFrame> searchProfileFrameList() {
        return profileFrameRepository.findAll();
    }

    @Override
    public List<MessageTypeResource> searchMessageTypeList() {
        List<MessageTypeResource> messageTypeList = new ArrayList<>();
        for (MessageType messageType : MessageType.values()) {
            messageTypeList.add(new MessageTypeResource(messageType.name(), messageType.getCode()));
        }
        return messageTypeList;
    }

    @Override
    public List<ResourceChecksum> searchResourceChecksum() {
        return resourceChecksumRepository.findAll();
    }

    private String makeObjectChecksum(Object object) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            //Object를 jsonString으로 변환
            String jsonString = objectMapper.writeValueAsString(object);
            System.out.println(jsonString);
            //MD5를 통해 해싱 -> checksumByte.length=16
            byte[] checksumByte = MessageDigest.getInstance("MD5").digest(jsonString.getBytes());

            System.out.println(HexUtils.toHexString(checksumByte));
            return HexUtils.toHexString(checksumByte);
//            return Base64.getEncoder().encodeToString(checksumByte);
        } catch (NoSuchAlgorithmException | JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    //각 리소스 체크섬 저장
    // 체크섬 저장 시 Object를 json String으로 변환 후 계산
    //TODO- 인터페이스 분리 체크
    @Override
    public void saveResourceChecksum(String resourceName, Object object) {
        resourceChecksumRepository.save(new ResourceChecksum(resourceName, makeObjectChecksum(object)));
    }

}
