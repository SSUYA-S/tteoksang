package com.welcome.tteoksang.resource.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Product implements Serializable {
    @Id
    @Column(name = "product_id")
    Integer productId;
    @Column(name = "product_name")
    String productName;
    @Column(name = "product_type")
    String productType;
    @Column(name = "product_unit")
    String productUnit;

    ////
    @Column(name = "product_basic_cost")
    Integer productBasicCost;

    @Column(name = "product_min_rate")
    Integer productMinRate;
    @Column(name = "product_max_rate")
    Integer productMaxRate;
}
