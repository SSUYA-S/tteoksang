package com.welcome.tteoksang.auth.service;

import com.welcome.tteoksang.auth.dto.res.LoginRes;
import com.welcome.tteoksang.auth.jwt.JWTUtil;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.exception.UserNotExistException;
import com.welcome.tteoksang.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

//    private final UserRepository userRepository;
//
//    private final RedisService redisService;
//    private final JWTUtil jwtUtil;

}