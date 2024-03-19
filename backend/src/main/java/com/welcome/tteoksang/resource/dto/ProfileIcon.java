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
public class ProfileIcon {
    @Id
    @Column(name = "profile_icon_id")
    Integer profileIconId;
    @Column(name = "profile_icon_name")
    String profileIconName;
}
