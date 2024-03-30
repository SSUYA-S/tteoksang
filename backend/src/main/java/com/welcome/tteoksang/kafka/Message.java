package com.welcome.tteoksang.kafka;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class Message {
    private String type;
    private Object body;
}
