package com.welcome.tteoksang.resource.repository;

import com.welcome.tteoksang.resource.dto.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,Integer> {

}
