package com.welcome.tteoksang.user.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "game_info")
public class GameInfo implements Serializable {
    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "game_id")
    private Integer gameId;

    @Column(name = "gold")
    private Long gold;

    @Column(name = "last_quarter_gold")
    private Long lastQuarterGold;

    @Column(name = "last_half_gold")
    private Long lastHalfGold;

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

    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @Column(name = "last_connect_time")
    private LocalDateTime lastConnectTime;

    @Column(name = "purchase_quantity")
    private Integer purchaseQuantity;

    @Column(name = "total_product_quantity")
    private Integer totalProductQuantity;

    @Lob
    @Column(name = "products")
    private byte[] products;    // 사용시 역직렬화

    @Column(name = "rent_fee")
    private Long rentFee;
}
