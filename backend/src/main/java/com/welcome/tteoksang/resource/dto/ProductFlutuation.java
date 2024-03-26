package com.welcome.tteoksang.resource.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ProductFlutuation {

    @Id
    Integer countPerTenDays;
    @Id
    Integer productId;

    Double minFluctuationRate;

    Double maxFluctuationRate;
}
