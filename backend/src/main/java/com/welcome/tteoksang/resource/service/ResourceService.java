package com.welcome.tteoksang.resource.service;

import com.welcome.tteoksang.resource.dto.*;
import com.welcome.tteoksang.resource.dto.res.*;

import java.util.List;

public interface ResourceService {
    //INFRA resource
    List<Warehouse> searchWarehouseList();
    List<Vehicle> searchVehicleList();
    List<Broker> searchBrokerList();
    SearchInfraResourceRes searchInfraResource();

    //PRODUCT resource
    List<ProductResource> searchProductList();

    //PROFILE & THEME resource
    List<ProfileIcon> searchProfileIconList();
    List<ProfileFrame> searchProfileFrameList();
    List<Theme> searchThemeList();

    //TITLE & ACHIEVEMENT resource
    List<Title> searchTitleList();
    List<AchievementResource> searchAchievementList();

    //EVENT resource
    List<EventResource> searchEventList();

    //MESSAGE-TYPE resource
    List<MessageTypeResource> searchMessageTypeList();
    //MESSAGE-TYPE -> Test
    void searchMessageTypeList(String name);

    void saveResourceChecksum(String resourceName, Object object);
    List<ResourceChecksum> searchResourceChecksum();
}
