package com.welcome.tteoksang.user.service;

import com.welcome.tteoksang.user.dto.Achieve;

import com.welcome.tteoksang.user.dto.AchieveRes;
import com.welcome.tteoksang.user.repository.AchieveRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AchieveServiceImpl implements AchieveService {

    private final AchieveRepository achieveRepository;

    @Override
    public List<AchieveRes> searchAllAchieve(String userId) {
        List<Achieve> achieveList = achieveRepository.findByUserId(userId);
        List<AchieveRes> achieveResList = new ArrayList<>();
        for(Achieve achieve : achieveList) {
            achieveResList.add(new AchieveRes(achieve.getAchievementId(), (achieve.getAchievedDate()).toString()));
        }
        return achieveResList;
    }
}
