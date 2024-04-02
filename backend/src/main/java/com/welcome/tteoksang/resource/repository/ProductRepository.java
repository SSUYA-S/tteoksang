package com.welcome.tteoksang.resource.repository;

import com.welcome.tteoksang.resource.dto.Product;
import com.welcome.tteoksang.resource.type.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Integer> {

    List<Product> findAllByProductTypeOrProductType(ProductType season, ProductType all);

    @Query("SELECT p.productId FROM Product p WHERE p.productType = ?1")
    List<Integer> findProductIdsByProductType(ProductType productType);
}
