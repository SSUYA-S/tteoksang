package com.welcome.tteoksang.game.dto.result;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sellerbrity implements Comparable<Sellerbrity>{
    private String userId;
    private Long totalAccPrivateProductProfit;

    @Override
    public int compareTo(Sellerbrity s) {
        return (int) (s.totalAccPrivateProductProfit - this.totalAccPrivateProductProfit);
    }
}
