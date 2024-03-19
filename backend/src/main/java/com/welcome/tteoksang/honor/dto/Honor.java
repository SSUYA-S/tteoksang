package com.welcome.tteoksang.honor.dto;

import com.welcome.tteoksang.resource.dto.Title;
import com.welcome.tteoksang.user.dto.User;
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
@Table(name = "honor")
public class Honor {
    @EmbeddedId
    private HonorId honorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "title_id")
    private Title title;

    @CreationTimestamp(source = SourceType.DB)
    @Column(name = "honored_date", nullable = false)
    private LocalDateTime honoredDate;
}
