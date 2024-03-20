package com.welcome.tteoksang.resource.controller;

import com.welcome.tteoksang.resource.dto.ResourceChecksum;
import com.welcome.tteoksang.resource.dto.res.*;
import com.welcome.tteoksang.resource.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/resource")
//@RequiredArgsConstructor
public class ResourceController { //tteoksang.me 접속과 동시에 불러오는 리소스 조회

    private final ResourceService resourceService;
    @Autowired
    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
        reloadResource();
    }

    @GetMapping("/achievement")
    ResponseEntity<SearchAchievementResourceRes> searchAchievementResource() {
        return ResponseEntity.ok(
                SearchAchievementResourceRes.builder()
                        .achievementList(resourceService.searchAchievementList())
                        .build()
        );
    }

    @GetMapping("/title")
    ResponseEntity<SearchTitleResourceRes> searchTitleResource() {
        return ResponseEntity.ok(
                SearchTitleResourceRes.builder()
                        .titleList(resourceService.searchTitleList())
                        .build()
        );
    }

    @GetMapping("/theme")
    ResponseEntity<SearchThemeResourceRes> searchThemeResource() {
        return ResponseEntity.ok(
                SearchThemeResourceRes.builder()
                        .themeList(resourceService.searchThemeList())
                        .build()
        );
    }

    @GetMapping("/product")
    ResponseEntity<SearchProductResourceRes> searchProductResource() {
        return ResponseEntity.ok(
                SearchProductResourceRes.builder()
                        .productList(resourceService.searchProductList())
                        .build()
        );
    }

    @GetMapping("/event")
    ResponseEntity<SearchEventResourceRes> searchEventResource() {
        return ResponseEntity.ok(
                SearchEventResourceRes.builder()
                        .eventList(resourceService.searchEventList())
                        .build()
        );
    }

    @GetMapping("/infra")
    ResponseEntity<SearchInfraResourceRes> searchInfraResource() {
        return ResponseEntity.ok(
                SearchInfraResourceRes.builder()
                        .brokerInfoList(resourceService.searchBrokerList())
                        .vehicleInfoList(resourceService.searchVehicleList())
                        .warehouseInfoList(resourceService.searchWarehouseList())
                        .build()
        );
    }

    @GetMapping("/profile-icon")
    ResponseEntity<SearchProfileIconResourceRes> searchProfileIconResource() {
        return ResponseEntity.ok(
                SearchProfileIconResourceRes.builder()
                        .profileIconList(resourceService.searchProfileIconList())
                        .build()
        );
    }

    @GetMapping("/profile-frame")
    ResponseEntity<SearchProfileFrameResourceRes> searchProfileFrameResource() {
        return ResponseEntity.ok(
                SearchProfileFrameResourceRes.builder()
                        .profileFrameList(resourceService.searchProfileFrameList())
                        .build()
        );
    }

    @GetMapping("/message-type/{name}")
    ResponseEntity<Void> searchMessageTypeResource(@PathVariable String name) {
        resourceService.searchMessageTypeList(name);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/message-type")
    ResponseEntity<SearchMessageTypeResourceRes> searchMessageTypeResource() {
        return ResponseEntity.ok(
                SearchMessageTypeResourceRes.builder()
                        .messageTypeList(resourceService.searchMessageTypeList())
                        .build()
        );
    }

    @GetMapping("/checksum")
    ResponseEntity<SearchChecksumRes> searchChecksumResource() {
        return ResponseEntity.ok(
                SearchChecksumRes.builder()
                        .checksumList(resourceService.searchResourceChecksum())
                        .build()
        );
    }

    //checksum 재계산: 처음 프로젝트 생성될 때, DB 변경되었을 때 실행
    @GetMapping("/reload-resource")
    void reloadResource() {
        resourceService.saveResourceChecksum("infra",
                SearchInfraResourceRes.builder()
                        .brokerInfoList(resourceService.searchBrokerList())
                        .warehouseInfoList(resourceService.searchWarehouseList())
                        .vehicleInfoList(resourceService.searchVehicleList())
                        .build()
        );
        resourceService.saveResourceChecksum("product",
                SearchProductResourceRes.builder()
                        .productList(resourceService.searchProductList())
                        .build()
        );
        resourceService.saveResourceChecksum("profile-frame",
                SearchProfileFrameResourceRes.builder()
                        .profileFrameList(resourceService.searchProfileFrameList())
                        .build()
        );
        resourceService.saveResourceChecksum("profile-icon",
                SearchProfileIconResourceRes.builder()
                        .profileIconList(resourceService.searchProfileIconList())
                        .build()
        );
        resourceService.saveResourceChecksum("theme",
                SearchThemeResourceRes.builder()
                        .themeList(resourceService.searchThemeList())
                        .build()
        );
        resourceService.saveResourceChecksum("title",
                SearchTitleResourceRes.builder()
                        .titleList(resourceService.searchTitleList())
                        .build()
        );
        resourceService.saveResourceChecksum("achievement",
                SearchAchievementResourceRes.builder()
                        .achievementList(resourceService.searchAchievementList())
                        .build()
        );
        resourceService.saveResourceChecksum("event",
                SearchEventResourceRes.builder()
                        .eventList(resourceService.searchEventList())
                        .build()
        );
        resourceService.saveResourceChecksum("message-type",
                SearchMessageTypeResourceRes.builder()
                        .messageTypeList(resourceService.searchMessageTypeList())
                        .build()
        );
    }
}
