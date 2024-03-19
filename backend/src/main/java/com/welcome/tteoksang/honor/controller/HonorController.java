package com.welcome.tteoksang.honor.controller;


import com.welcome.tteoksang.honor.dto.res.SearchHonorRes;
import com.welcome.tteoksang.honor.service.HonorService;
import com.welcome.tteoksang.user.dto.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/title")
public class HonorController {
    private final HonorService honorService;

    @GetMapping
    public ResponseEntity<SearchHonorRes> searchHonor(@AuthenticationPrincipal User user) {
        List<Integer> honorList = honorService.searchAllHonor(user.getUserId());

        return ResponseEntity.ok()
                .body(
                        SearchHonorRes.builder()
                                .acquiredTitleList(honorList)
                                .build()
                );
    }
}
