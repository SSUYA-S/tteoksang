package com.welcome.tteoksang.resource.service;

import com.welcome.tteoksang.resource.dto.*;
import com.welcome.tteoksang.resource.dto.req.AchievementResource;
import com.welcome.tteoksang.resource.dto.req.EventResource;
import com.welcome.tteoksang.resource.dto.req.ProductResource;
import com.welcome.tteoksang.resource.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService{

    private final AchievementRepository achievementRepository;
    private final BrokerRepository brokerRepository;
    private final ProductRepository productRepository;
    private final ProfileFrameRepository profileFrameRepository;
    private final ProfileIconRepository profileIconRepository;
    private final ThemeRepository themeRepository;
    private final TitleRepository titleRepository;
    private final VehicleRepository vehicleRepository;
    private final WarehouseRepository warehouseRepository;

    //TODO - 도전과제 넣을 내용 확정
    @Override
    public List<AchievementResource> searchAchievementList() {
        List<AchievementResource> achievementResourceList=new ArrayList<>();
        for(Achievement achievement:achievementRepository.findAll()){
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
    public String getAchievementGoalDescription(){
        StringBuilder sb=new StringBuilder();

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
        List<ProductResource> productResourceList=new ArrayList<>();
        for(Product product:productRepository.findAll()){
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
        List<EventResource> eventResourceList=new ArrayList<>();
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
    public List<ProfileIcon> searchProfileIconList() {
        return profileIconRepository.findAll();
    }

    @Override
    public List<ProfileFrame> searchProfileFrameList() {
        return profileFrameRepository.findAll();
    }

    //TODO
    @Override
    public void searchMessageTypeList() {

    }
    //TODO
    @Override
    public void searchChecksum() {

    }
}
