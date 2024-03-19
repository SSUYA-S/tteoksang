package com.welcome.tteoksang.resource.controller;

import com.welcome.tteoksang.resource.dto.req.*;
import com.welcome.tteoksang.resource.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/resource")
@RequiredArgsConstructor
public class ResourceController { //tteoksang.me 접속과 동시에 불러옴

    private final ResourceService resourceService;

    @GetMapping("/achievement")
    ResponseEntity<SearchAchievementResourceReq> searchAchievementResource() {
        return ResponseEntity.ok(
                SearchAchievementResourceReq.builder()
                        .achievementList(resourceService.searchAchievementList())
                        .build()
        );
    }

    @GetMapping("/title")
    ResponseEntity<SearchTitleResourceReq> searchTitleResource() {
        return ResponseEntity.ok(
                SearchTitleResourceReq.builder()
                        .titleList(resourceService.searchTitleList())
                        .build()
        );
    }

    @GetMapping("/theme")
    ResponseEntity<SearchThemeResourceReq> searchThemeResource() {
        return ResponseEntity.ok(
                SearchThemeResourceReq.builder()
                        .themeList(resourceService.searchThemeList())
                        .build()
        );
    }

    @GetMapping("/product")
    ResponseEntity<SearchProductResourceReq> searchProductResource() {
        return ResponseEntity.ok(
                SearchProductResourceReq.builder()
                        .productList(resourceService.searchProductList())
                        .build()
        );
    }

    @GetMapping("/event")
    ResponseEntity<SearchEventResourceReq> searchEventResource() {
        return ResponseEntity.ok(
                SearchEventResourceReq.builder()
                        .eventList(resourceService.searchEventList())
                        .build()
        );
    }

    @GetMapping("/infra")
    ResponseEntity<SearchInfraResourceReq> searchInfraResource() {
        return ResponseEntity.ok(
                SearchInfraResourceReq.builder()
                        .brokerInfoList(resourceService.searchBrokerList())
                        .vehicleInfoList(resourceService.searchVehicleList())
                        .warehouseInfoList(resourceService.searchWarehouseList())
                        .build()
        );
    }

    @GetMapping("/profile-icon")
    ResponseEntity<SearchProfileIconResourceReq> searchProfileIconResource() {
        return ResponseEntity.ok(
                SearchProfileIconResourceReq.builder()
                        .profileIconList(resourceService.searchProfileIconList())
                        .build()
        );
    }

    @GetMapping("/profile-frame")
    ResponseEntity<SearchProfileFrameResourceReq> searchProfileFrameResource() {
        return ResponseEntity.ok(
                SearchProfileFrameResourceReq.builder()
                        .profileFrameList(resourceService.searchProfileFrameList())
                        .build()
        );
    }


}
