package com.welcome.tteoksang.user.dto;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SourceType;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "achieve")
@IdClass(AchieveId.class)
public class Achieve {

    @Id
    private String userId;

    @Id
    private Integer achievementId;

    @CreationTimestamp(source = SourceType.DB)
    @Column(name = "achieved_date", nullable = false)
    private LocalDateTime achievedDate;
}
