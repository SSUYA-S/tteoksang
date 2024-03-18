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
public class Vehicle {
    @Id
    @Column(name = "vehicle_level")
    Integer vehicleLevel;
    @Column(name = "vehicle_name")
    String vehicleName;
    @Column(name = "vehicle_upgrade_fee")
    Integer vehicleUpgradeFee;
    @Column(name = "max_purchase_quantity")
    Integer vehicleCapacity;

    @Column(name = "vehicle_content")
    String vehicleContent;
}
