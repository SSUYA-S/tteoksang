package com.welcome.tteoksang.resource.dto;

import com.welcome.tteoksang.resource.dto.Broker;
import com.welcome.tteoksang.resource.dto.Vehicle;
import com.welcome.tteoksang.resource.dto.Warehouse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InfraResource {

    List<Broker> brokerInfoList;
    List<Warehouse> warehouseInfoList;
    List<Vehicle> vehicleInfoList;
}
