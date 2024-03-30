package com.welcome.tteoksang.resource.repository;

import com.welcome.tteoksang.resource.dto.Product;
import com.welcome.tteoksang.resource.type.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Integer> {

    List<Product> findAllByProductTypOrProductType(ProductType season, ProductType all);

}
