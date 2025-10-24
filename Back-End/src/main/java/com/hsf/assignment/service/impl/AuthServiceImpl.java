package com.hsf.assignment.service.impl;

import com.hsf.assignment.dto.request.RegisterRequest;
import com.hsf.assignment.dto.response.RegisterResponse;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.exception.DuplicateResourceException;
import com.hsf.assignment.mapper.UserMapper;
import com.hsf.assignment.repository.UserRepository;
import com.hsf.assignment.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


    @Override
    public RegisterResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUserName(registerRequest.getUsername())) {
            throw new DuplicateResourceException("Tên đăng nhập đã tồn tại");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Email đã được sử dụng");
        }

        User user = userMapper.toEntity(registerRequest);

        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        User savedUser = userRepository.save(user);
        return userMapper.toRegisterResponse(savedUser);
    }
}
