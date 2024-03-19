package com.welcome.tteoksang.user.dto;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="profile_icon")
public class ProfileIcon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_icon_id")
    private int profileIconId;

    @Column(name = "profile_icon_name", nullable = false)
    private String profileIconName;
}
