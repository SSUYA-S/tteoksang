package com.welcome.tteoksang.user.repository;

import com.welcome.tteoksang.user.dto.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {

  Optional<User> findByUserEmailAndDeletedAtIsNull(String userEmail);

  Optional<User> findByUserIdAndDeletedAtIsNull(String userId);

  Optional<User> findByUserId(String userId);
}
