package com.welcome.tteoksang.resource.dto.req;

import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResource {

    Integer productId;
    String productName;
    String productType;
    String productUnit;
}
