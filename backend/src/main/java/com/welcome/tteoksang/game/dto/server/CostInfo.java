package com.welcome.tteoksang.game.dto.server;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
public class CostInfo implements Serializable {
    long cost;
    int turn;
}
