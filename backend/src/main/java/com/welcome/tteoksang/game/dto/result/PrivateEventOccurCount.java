package com.welcome.tteoksang.game.dto.result;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrivateEventOccurCount {
    @Field("privateEventId")
    private String privateEventId;

    @Field("count")
    private Integer count;
}
