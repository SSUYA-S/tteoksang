package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.Chat;
import com.welcome.tteoksang.redis.RedisService;
import com.welcome.tteoksang.user.dto.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final RedisService redisService;

    @Override
    public Chat sendChat(User user, Map<String, Object> body) {
        String message = (String) body.get("message");
        if (message == null) return null;
        message = message.trim();
        if (message.length() == 0) return null;

        //TODO- redis에서 정보 빼오는 것으로 변경
        // - principal 자체에 정보 저장해둘 수 있는지 확인
//        redisService.getValues()
        return Chat.builder()
                .message(message)
                .profileFrameId(user.getProfileFrame().getProfileFrameId())
                .profileIconId(user.getProfileIcon().getProfileIconId())
                .userNickname(user.getUserNickname())
                .build();
    }
}
