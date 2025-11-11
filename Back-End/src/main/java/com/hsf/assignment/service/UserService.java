package com.hsf.assignment.service;

import com.hsf.assignment.dto.request.AdminUpdateRequest;
import com.hsf.assignment.dto.request.UserProfileRequest;
import com.hsf.assignment.dto.response.AdminResponse;
import com.hsf.assignment.dto.response.UserProfileResponse;
import com.hsf.assignment.dto.response.UserResponse;
import com.hsf.assignment.entity.User;

import java.util.List;

public interface UserService{
    List<AdminResponse> getAllUsers();
    AdminResponse getUserById(Long userId);
    AdminResponse updatedUser(Long userId, AdminUpdateRequest adminUpdateRequest);
    void deleteUser(Long userId);
    UserResponse updateUser(UserProfileRequest userProfileRequest);
    UserProfileResponse getUserProfile();
}
