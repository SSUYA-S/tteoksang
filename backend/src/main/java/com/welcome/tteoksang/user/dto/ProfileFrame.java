package com.welcome.tteoksang.user.dto;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="profile_frame")
public class ProfileFrame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_frame_id")
    private int profileFrameId;

    @Column(name = "profile_frame_name", nullable = false)
    private String profileFrameName;
}
