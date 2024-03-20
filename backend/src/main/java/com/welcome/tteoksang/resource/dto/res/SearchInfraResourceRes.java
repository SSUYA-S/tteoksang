package com.welcome.tteoksang.resource.dto.res;

import com.welcome.tteoksang.resource.dto.Broker;
import com.welcome.tteoksang.resource.dto.Vehicle;
import com.welcome.tteoksang.resource.dto.Warehouse;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchInfraResourceRes implements Serializable {

    List<Broker> brokerInfoList;
    List<Warehouse> warehouseInfoList;
    List<Vehicle> vehicleInfoList;

}
