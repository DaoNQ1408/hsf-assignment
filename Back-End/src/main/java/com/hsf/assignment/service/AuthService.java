package com.hsf.assignment.service;

import com.hsf.assignment.dto.request.LoginRequest;
import com.hsf.assignment.dto.request.RegisterRequest;
import com.hsf.assignment.dto.response.LoginResponse;
import com.hsf.assignment.dto.response.RegisterResponse;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    RegisterResponse register(RegisterRequest registerRequest);
    LoginResponse login(LoginRequest loginRequest);
}
