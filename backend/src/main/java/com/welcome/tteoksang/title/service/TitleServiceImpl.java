package com.welcome.tteoksang.title.service;

import com.welcome.tteoksang.title.repository.HonorRepository;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.dto.req.UpdateUserReq;
import com.welcome.tteoksang.user.exception.NicknameNullException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TitleServiceImpl implements TitleService {

    private final HonorRepository honorRepository;

    @Override
    public List<Integer> searchAllHonor(String userId) {
        return honorRepository.findTitleIdsByUserId(userId);
    }
}
