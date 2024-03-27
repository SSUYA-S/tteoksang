package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.Chat;
import com.welcome.tteoksang.redis.RedisPrefix;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.user.dto.User;
import com.welcome.tteoksang.user.dto.UserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final RedisService redisService;

    @Override
    public Chat sendChat(String userId, Map<String, Object> body) {
        String message = (String) body.get("message");
        if (message == null) return null;
        message = message.trim();
        if (message.length() == 0) return null;

        String userInfoKey = RedisPrefix.USERINFO.prefix() + userId;
        UserInfo userInfo = (UserInfo) redisService.getValues(userInfoKey);
        return Chat.builder()
                .message(message)
                .profileFrameId(userInfo.getProfileFrameId())
                .profileIconId(userInfo.getProfileIconId())
                .userNickname(userInfo.getNickname())
                .build();
    }
}
