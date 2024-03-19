package com.welcome.tteoksang.honor.service;

import com.welcome.tteoksang.honor.repository.HonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HonorServiceImpl implements HonorService {

    private final HonorRepository honorRepository;

    @Override
    public List<Integer> searchAllHonor(String userId) {
        return honorRepository.findTitleIdsByUserId(userId);
    }
}
