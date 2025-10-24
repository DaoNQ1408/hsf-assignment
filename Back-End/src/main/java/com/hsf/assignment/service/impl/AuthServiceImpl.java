package com.hsf.assignment.service.impl;

import com.hsf.assignment.dto.request.LoginRequest;
import com.hsf.assignment.dto.request.RegisterRequest;
import com.hsf.assignment.dto.response.LoginResponse;
import com.hsf.assignment.dto.response.RegisterResponse;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.exception.DuplicateResourceException;
import com.hsf.assignment.mapper.UserMapper;
import com.hsf.assignment.repository.UserRepository;
import com.hsf.assignment.service.AuthService;
import com.hsf.assignment.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    @Override
    public RegisterResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new DuplicateResourceException("Tên đăng nhập đã tồn tại");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Email đã được sử dụng");
        }

        User user = userMapper.toEntity(registerRequest);

        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        User savedUser = userRepository.save(user);

        String accessToken = jwtService.generateToken(savedUser);
        RegisterResponse registerResponse = userMapper.toRegisterResponse(savedUser);
        registerResponse.setToken(accessToken);
        userRepository.save(savedUser);
        return registerResponse;
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
            throw new IllegalArgumentException("Thiếu thông tin đăng nhập");
        }

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Tên đăng nhập không tồn tại"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác");
        }

        String accessToken = jwtService.generateToken(user);
        LoginResponse response = userMapper.toLoginResponse(user);
        response.setToken(accessToken);
        userRepository.save(user);

        return response;
    }
}
