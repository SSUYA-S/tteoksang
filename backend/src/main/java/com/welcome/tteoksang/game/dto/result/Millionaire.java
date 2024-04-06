package com.welcome.tteoksang.game.dto.result;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Millionaire implements Comparable<Millionaire>{
    private String userId;
    private Long gold;

    @Override
    public int compareTo(Millionaire m) {
        return m.gold.compareTo(this.gold);
    }
}
