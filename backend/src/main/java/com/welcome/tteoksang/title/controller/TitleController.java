package com.welcome.tteoksang.title.controller;


import com.welcome.tteoksang.title.dto.res.SearchHonorRes;
import com.welcome.tteoksang.title.service.TitleService;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.dto.res.SearchUserInfoRes;
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
public class TitleController {
    private final TitleService titleService;

    @GetMapping
    public ResponseEntity<SearchHonorRes> searchHonor(@AuthenticationPrincipal User user) {
        List<Integer> honorList = titleService.searchAllHonor(user.getUserId());

        return ResponseEntity.ok()
                .body(
                        SearchHonorRes.builder()
                                .acquiredTitleList(honorList)
                                .build()
                );
    }
}
