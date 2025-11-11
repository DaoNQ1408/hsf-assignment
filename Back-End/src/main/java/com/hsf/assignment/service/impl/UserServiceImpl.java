package com.hsf.assignment.service.impl;

import com.hsf.assignment.Enum.UserStatus;
import com.hsf.assignment.dto.request.AdminUpdateRequest;
import com.hsf.assignment.dto.request.UserProfileRequest;
import com.hsf.assignment.dto.response.AdminResponse;
import com.hsf.assignment.dto.response.UserProfileResponse;
import com.hsf.assignment.dto.response.UserResponse;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.mapper.UserMapper;
import com.hsf.assignment.repository.UserRepository;
import com.hsf.assignment.service.ImageService;
import com.hsf.assignment.service.UserService;
import com.hsf.assignment.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserUtils userUtils;
    private final ImageService imageService;

    @Override
    public List<AdminResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.toAdminResponseList(users);
    }

    @Override
    public AdminResponse getUserById(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        return userMapper.toAdminResponse(user);
    }

    @Override
    public AdminResponse updatedUser(Long userId, AdminUpdateRequest adminUpdateRequest) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        userMapper.updateUser(adminUpdateRequest, user);
        User updatedUser = userRepository.save(user);
        return userMapper.toAdminResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(UserProfileRequest userProfileRequest) {
        User user = userUtils.getCurrentUser();
        imageService.uploadUserImage(userProfileRequest.getImageUrl());
        user.setPhone(userProfileRequest.getPhone());
        user.setEmail(userProfileRequest.getEmail());
        User savedUser = userRepository.save(user);

        return userMapper.toUserResponse(savedUser);
    }

    @Override
    public UserProfileResponse getUserProfile() {
        User user = userUtils.getCurrentUser();
        UserProfileResponse userProfileResponse = new UserProfileResponse();
        userProfileResponse.setUserId(user.getUserId());
        userProfileResponse.setUserName(user.getUsername());
        userProfileResponse.setEmail(user.getEmail());
        userProfileResponse.setPhone(user.getPhone());
        userProfileResponse.setImageUrl(user.getImage() != null ? user.getImage().getImageUrl() : null);
        return userProfileResponse;
    }

}
