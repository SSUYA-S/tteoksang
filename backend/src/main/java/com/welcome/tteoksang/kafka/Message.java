package com.welcome.tteoksang.kafka;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Message {
    private String type;
    private Object body;
}
