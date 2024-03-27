package com.welcome.tteoksang.game.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@IdClass(ProductFluctuationId.class)
public class ProductFluctuation {

    @Id
    @Column(name = "count_per_ten_days")
    Integer countPerTenDays;
    @Id
    @Column(name = "product_id")
    Integer productId;

    @Column(name = "product_min_rate")
    Double minFluctuationRate;

    @Column(name = "product_max_rate")
    Double maxFluctuationRate;
}
