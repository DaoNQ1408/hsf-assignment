package com.hsf.assignment.service;

import com.hsf.assignment.dto.request.AdminUpdateRequest;
import com.hsf.assignment.dto.response.AdminResponse;

import java.util.List;

public interface UserService{
    List<AdminResponse> getAllUsers();
    AdminResponse getUserById(Long userId);
    AdminResponse updatedUser(Long userId, AdminUpdateRequest adminUpdateRequest);
}
