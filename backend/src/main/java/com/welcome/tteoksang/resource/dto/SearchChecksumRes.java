package com.welcome.tteoksang.resource.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchChecksumRes {
    List<ResourceChecksum> checksumList;
}
