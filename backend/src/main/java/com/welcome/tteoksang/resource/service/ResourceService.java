package com.welcome.tteoksang.resource.service;

import com.welcome.tteoksang.resource.dto.*;
import com.welcome.tteoksang.resource.dto.req.*;
import java.util.List;

public interface ResourceService {

    List<AchievementResource> searchAchievementList();

    List<Title> searchTitleList();

    List<Theme> searchThemeList();

    List<ProductResource> searchProductList();

    List<EventResource> searchEventList();

    List<Warehouse> searchWarehouseList();
    List<Vehicle> searchVehicleList();
    List<Broker> searchBrokerList();

    List<ProfileIcon> searchProfileIconList();

    List<ProfileFrame> searchProfileFrameList();

    void searchMessageTypeList();

    void searchChecksum();
}
