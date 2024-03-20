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
public class Broker  implements Serializable {

    @Id
    @Column(name = "broker_level")
    Integer brokerLevel;
    @Column(name = "broker_name")
    String brokerName;
    @Column(name = "broker_upgrade_fee")
    Integer brokerUpgradeFee;
    @Column(name = "broker_fee")
    Integer brokerFeeRate;

    @Column(name = "broker_content")
    String brokerContent;
}
