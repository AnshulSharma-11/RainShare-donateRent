package com.rainshare.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.rainshare.enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    @JsonAlias("full_name")
    private String fullName;

    private String email;

    private String password;

    private String phone;

    private String address;

    private Role role;
}
