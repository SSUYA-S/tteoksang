package com.welcome.tteoksang.game.dto.result.half;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class TteokValues implements Comparable<TteokValues> {
    private Integer productId;
    private Long value;

    @Override
    public int compareTo(TteokValues o) {
        return this.value.compareTo(o.value);
    }
}
