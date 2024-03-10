package com.welcome.tteoksang.user.dto.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchUserInfoRes {

    private String userId;
    private String userNickname;
    private String userEmail;
    private String userRole;

}
