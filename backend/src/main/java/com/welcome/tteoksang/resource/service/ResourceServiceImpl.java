package com.welcome.tteoksang.resource.service;

import com.welcome.tteoksang.resource.constant.CoreMessageType;
import com.welcome.tteoksang.resource.constant.MessageType;
import com.welcome.tteoksang.resource.dto.*;
import com.welcome.tteoksang.resource.dto.res.*;
import com.welcome.tteoksang.resource.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
//@RequiredArgsConstructor
@Transactional
public class ResourceServiceImpl implements ResourceService {

    private final AchievementRepository achievementRepository;
    private final BrokerRepository brokerRepository;
    private final ProductRepository productRepository;
    private final ProfileFrameRepository profileFrameRepository;
    private final ProfileIconRepository profileIconRepository;
    private final ThemeRepository themeRepository;
    private final TitleRepository titleRepository;
    private final VehicleRepository vehicleRepository;
    private final WarehouseRepository warehouseRepository;
    private final ResourceChecksumRepository resourceChecksumRepository;

    //TODO- DI 확인 및 더 좋은 로직 있는지 체크
    @Autowired //의존성 주입 및 체크섬 저장
    public ResourceServiceImpl(AchievementRepository achievementRepository, BrokerRepository brokerRepository, ProductRepository productRepository, ProfileFrameRepository profileFrameRepository, ProfileIconRepository profileIconRepository, ThemeRepository themeRepository, TitleRepository titleRepository, VehicleRepository vehicleRepository, WarehouseRepository warehouseRepository, ResourceChecksumRepository resourceChecksumRepository) {
        this.achievementRepository = achievementRepository;
        this.brokerRepository = brokerRepository;
        this.productRepository = productRepository;
        this.profileFrameRepository = profileFrameRepository;
        this.profileIconRepository = profileIconRepository;
        this.themeRepository = themeRepository;
        this.titleRepository = titleRepository;
        this.vehicleRepository = vehicleRepository;
        this.warehouseRepository = warehouseRepository;
        this.resourceChecksumRepository = resourceChecksumRepository;
        saveResourceChecksum();
    }

    //TODO - 도전과제 넣을 내용 확정
    @Override
    public List<AchievementResource> searchAchievementList() {
        List<AchievementResource> achievementResourceList = new ArrayList<>();
        for (Achievement achievement : achievementRepository.findAll()) {
            achievementResourceList.add(
                    AchievementResource.builder()
                            .achievementId(achievement.getAchievementId())
                            .achievementName(achievement.getAchievementName())
                            .achievementDescription(
                                    achievement.getAchievementContent()
                            )
                            .achievementGoal(achievement.getAchievementGoal())
                            .achievementGoalDescription(achievement.getAchievementContent())
                            .build()
            );
        }

        return achievementResourceList;
    }

    //TODO- goalDescription에 따라 description 생성
    public String getAchievementGoalDescription() {
        StringBuilder sb = new StringBuilder();

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
                            .productType(product.getProductType())
                            .productUnit(product.getProductUnit())
                            .build()
            );
        }

        return productResourceList;
    }

    //TODO
    @Override
    public List<EventResource> searchEventList() {
        List<EventResource> eventResourceList = new ArrayList<>();
        //TODO mongoDB에서 eventLIST 가져오기

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
    public SearchInfraResourceRes searchInfraResource() {
        return SearchInfraResourceRes.builder()
                .brokerInfoList(searchBrokerList())
                .vehicleInfoList(searchVehicleList())
                .warehouseInfoList(searchWarehouseList())
                .build();
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
            messageTypeList.add(new MessageTypeResource(messageType.name(), messageType.ordinal()));
        }
        return messageTypeList;
    }

    //TEST진행..
    @Override
    public void searchMessageTypeList(String name) {
        CoreMessageType myType = CoreMessageType.valueOf(name);
        System.out.println(myType);
        System.out.println(myType.name());
        System.out.println(myType.ordinal());
        System.out.println(myType.getCode());
//        CoreMessageType.
//        System.out.println(myType==MessageType.);
        System.out.println(CoreMessageType.ALERT_PLAYTIME.name());
        System.out.println(CoreMessageType.ALERT_PLAYTIME); //==NAME
        System.out.println(CoreMessageType.ALERT_PLAYTIME.ordinal());
        System.out.println(CoreMessageType.ALERT_PLAYTIME.getCode());

    }

    @Override
    public List<ResourceChecksum> searchResourceChecksum() {
        return resourceChecksumRepository.findAll();
    }

    //TODO- checksum 만드는 로직 확인
    private String makeObjectChecksum(Object object) {
        ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
        try {
            //byteStream에 Object 직렬화 결과를 저장하기 위한 objectOutputStream
            ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteStream);
            objectOutputStream.writeObject(object);
            objectOutputStream.close();
            //byteStream에 저장 완료 후 종료

            //MD5를 통해 해싱 -> checksumByte.length=16
            byte[] checksumByte = MessageDigest.getInstance("MD5").digest(byteStream.toByteArray());

            return Base64.getEncoder().encodeToString(checksumByte);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    // 각 ResourceChecksum 저장하는 메서드. 
    // ResourceService bean 생성 시 한 번만 동작하도록 구성
    private void saveResourceChecksum() {
        resourceChecksumRepository.save(
                new ResourceChecksum("infra", makeObjectChecksum(searchInfraResource()))
        );
        resourceChecksumRepository.save(
                new ResourceChecksum("product", makeObjectChecksum(searchProductList()))
        );
        resourceChecksumRepository.save(
                new ResourceChecksum("profile-frame", makeObjectChecksum(searchProfileFrameList()))
        );
        resourceChecksumRepository.save(
                new ResourceChecksum("profile-icon", makeObjectChecksum(searchProfileIconList()))
        );
        resourceChecksumRepository.save(
                new ResourceChecksum("theme", makeObjectChecksum(searchThemeList()))
        );
        resourceChecksumRepository.save(
                new ResourceChecksum("title", makeObjectChecksum(searchTitleList()))
        );
        resourceChecksumRepository.save(
                new ResourceChecksum("achievement", makeObjectChecksum(searchAchievementList()))
        );
        resourceChecksumRepository.save(
                new ResourceChecksum("event", makeObjectChecksum(searchEventList()))
        );
        resourceChecksumRepository.save(
                new ResourceChecksum("message-type", makeObjectChecksum(searchMessageTypeList()))
        );
    }
}
