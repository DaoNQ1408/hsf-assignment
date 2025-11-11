package com.hsf.assignment.service.impl;

import com.hsf.assignment.dto.request.AdminUpdateRequest;
import com.hsf.assignment.dto.response.AdminResponse;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.mapper.UserMapper;
import com.hsf.assignment.repository.UserRepository;
import com.hsf.assignment.service.UserService;
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
}
