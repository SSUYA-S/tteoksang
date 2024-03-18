package com.welcome.tteoksang.resource.dto.req;

import com.welcome.tteoksang.resource.dto.Broker;
import com.welcome.tteoksang.resource.dto.Vehicle;
import com.welcome.tteoksang.resource.dto.Warehouse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchInfraResourceReq {

    List<Broker> brokerInfoList;
    List<Warehouse> warehouseInfoList;
    List<Vehicle> vehicleInfoList;

}
