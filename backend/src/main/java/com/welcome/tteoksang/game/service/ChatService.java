package com.welcome.tteoksang.game.service;

import com.welcome.tteoksang.game.dto.Chat;
import com.welcome.tteoksang.user.dto.User;

import java.util.Map;

public interface ChatService {
    Chat sendChat(String userId, Map<String,Object> body);
}
