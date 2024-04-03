package com.welcome.tteoksang.game.dto.server;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CostInfo implements Serializable {
    long cost;
    int turn;
}
