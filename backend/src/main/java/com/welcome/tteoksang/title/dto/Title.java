package com.welcome.tteoksang.title.dto;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "title")
public class Title {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "title_id")
    private int titleId;

    @Column(name = "title_name", nullable = false)
    private String titleName;

    @Column(name = "title_content")
    private String titleContent;
}
