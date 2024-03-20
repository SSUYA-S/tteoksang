package com.welcome.tteoksang.user.dto;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class HonorId implements Serializable {
    private String honorUserId;
    private Integer honorTitleId;
}
