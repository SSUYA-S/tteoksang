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
public class ProfileFrame implements Serializable {

    @Id
    @Column(name = "profile_frame_id")
    Integer profileFrameId;
    @Column(name = "profile_frame_name")
    String profileFrameName;
}
