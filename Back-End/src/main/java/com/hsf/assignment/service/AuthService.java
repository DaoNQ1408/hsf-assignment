package com.hsf.assignment.service;

import com.hsf.assignment.dto.request.RegisterRequest;
import com.hsf.assignment.dto.response.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterRequest registerRequest);
}
