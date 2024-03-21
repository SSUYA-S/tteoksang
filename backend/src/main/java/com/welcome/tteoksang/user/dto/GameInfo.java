package com.welcome.tteoksang.user.dto;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "game_info")
public class GameInfo {

    @Id
    private String userId;

    @Column(name = "game_id")
    private Integer gameId;

    @Column(name = "gold")
    private Long gold;

    @Column(name = "warehouse_level")
    private Integer warehouseLevel;

    @Column(name = "vehicle_level")
    private Integer vehicleLevel;

    @Column(name = "broker_level")
    private Integer brokerLevel;

    @Column(name = "private_event_id")
    private String privateEventId;

    @Column(name = "last_play_turn")
    private Integer lastPlayTurn;

    @Column(name = "last_connect_time")
    private LocalDateTime lastConnectTime;

    @Column(name = "purchase_quantity")
    private Integer purchaseQuantity;

    @Lob
    @Column(name = "products")
    private byte[] products;    // 사용시 역직렬화

    @Column(name = "rent_fee")
    private Long rentFee;
}
