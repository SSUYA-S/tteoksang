package com.welcome.tteoksang.user.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SourceType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class User implements UserDetails {

  @Id
  @Column(name = "user_id")
  @Builder.Default
  private String userId = UUID.randomUUID().toString();

  @Email
  @Column(name = "user_email", nullable = false)
  private String userEmail;

  @NotBlank
  @Column(name = "user_nickname", nullable = false)
  private String userNickname;

  @CreationTimestamp(source = SourceType.DB)
  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "deleted_at", nullable = false)
  private LocalDateTime deletedAt;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return new ArrayList<>();
  }

  @Override
  public String getPassword() {
    return "";
  }

  @Override
  public String getUsername() {
    return userEmail;
  }

  @Override
  public boolean isAccountNonExpired() {
    return deletedAt == null;
  }

  @Override
  public boolean isAccountNonLocked() {
    return deletedAt == null;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

}
