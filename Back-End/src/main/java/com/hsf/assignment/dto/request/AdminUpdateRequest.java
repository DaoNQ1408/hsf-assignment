package com.hsf.assignment.dto.request;

import com.hsf.assignment.Enum.UserRole;
import com.hsf.assignment.Enum.UserStatus;
import lombok.Data;

@Data
public class AdminUpdateRequest {
    private String phone;
    private UserRole role;
    private UserStatus status;
}
