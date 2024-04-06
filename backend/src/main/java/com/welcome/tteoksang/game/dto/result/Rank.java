package com.welcome.tteoksang.game.dto.result;

import lombok.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Component
public class Rank {
    // 랭킹
    private List<Sellerbrity> sellerbrityRank = new ArrayList<>();
    private List<Millionaire> millionaireRank = new ArrayList<>();
    private List<Tteoksang> tteoksangRank = new ArrayList<>();
}
