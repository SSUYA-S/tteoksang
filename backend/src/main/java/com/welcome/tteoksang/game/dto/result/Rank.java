package com.welcome.tteoksang.game.dto.result;

import lombok.*;
import org.springframework.stereotype.Component;

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
    private List<Sellerbrity> sellerbrityRank;
    private List<Millionaire> millionaireRank;
    private List<Tteoksang> tteoksangRank;
}
