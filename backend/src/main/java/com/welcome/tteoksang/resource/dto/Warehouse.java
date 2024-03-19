package com.welcome.tteoksang.resource.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Warehouse {

    @Id
    @Column(name = "warehouse_level")
    Integer warehouseLevel;
    @Column(name = "warehouse_name")
    String warehouseName;
    @Column(name = "warehouse_upgrade_fee")
    Integer warehouseUpgradeFee;
    @Column(name = "max_holding_quantity")
    Integer warehouseCapacity;
    @Column(name = "warehouse_content")
    String warehouseContent;
}
