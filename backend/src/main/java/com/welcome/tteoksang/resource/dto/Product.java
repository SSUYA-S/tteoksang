package com.welcome.tteoksang.resource.dto;

import com.welcome.tteoksang.resource.type.ProductType;
import jakarta.persistence.*;
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

    @Column(name = "product_unit")
    String productUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_type") // ,columnDefinition = "enum('ALL','SPRING','SUMMER','FALL','WINTER')"
    ProductType productType;

    ////
    @Column(name = "product_basic_cost")
    Integer productBasicCost;

    @Column(name = "product_basic_harvest")
    Integer productBasicHarvest;
}
