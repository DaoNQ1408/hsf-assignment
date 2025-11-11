package com.hsf.assignment.dto.response;

import com.hsf.assignment.Enum.UserRole;
import com.hsf.assignment.Enum.UserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminResponse {
    private Long userId;
    private String userName;
    private String email;
    private String phone;
    private UserRole role;
    private UserStatus status;
    private LocalDateTime createdAt;
}
