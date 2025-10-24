package com.hsf.assignment.dto.response;

import com.hsf.assignment.Enum.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private Long userId;
    private String username;
    private String email;
    private String phone;
    private UserRole role;
    private String token;
}
