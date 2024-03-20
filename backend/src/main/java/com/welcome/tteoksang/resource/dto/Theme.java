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
public class Theme implements Serializable {
    @Id
    @Column(name = "theme_id")
    Integer themeId;
    @Column(name = "theme_name")
    String themeName;
}
