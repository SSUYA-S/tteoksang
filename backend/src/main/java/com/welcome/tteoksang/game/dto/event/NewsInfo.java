package com.welcome.tteoksang.game.dto.event;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class NewsInfo {
    private Integer publishTurn;
    private List<Article> articleList;
}
