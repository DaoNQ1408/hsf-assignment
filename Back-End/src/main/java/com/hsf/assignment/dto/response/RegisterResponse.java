package com.hsf.assignment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterResponse {
    private Long userId;
    private String username;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
    private String token;
}
