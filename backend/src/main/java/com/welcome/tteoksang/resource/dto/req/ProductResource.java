package com.welcome.tteoksang.resource.dto.req;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResource  implements Serializable {

    Integer productId;
    String productName;
    String productType;
    String productUnit;
}
