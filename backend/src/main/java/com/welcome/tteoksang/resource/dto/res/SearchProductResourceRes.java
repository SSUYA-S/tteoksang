package com.welcome.tteoksang.resource.dto.res;

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
