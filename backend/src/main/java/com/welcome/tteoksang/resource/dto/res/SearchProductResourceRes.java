package com.welcome.tteoksang.resource.dto.res;

import com.welcome.tteoksang.resource.dto.ProductResource;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchProductResourceRes {
    List<ProductResource> productList;
}
