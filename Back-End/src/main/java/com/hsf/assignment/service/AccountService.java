package com.hsf.assignment.service;

import com.hsf.assignment.dto.response.UserResponse;
import com.hsf.assignment.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface AccountService extends UserDetailsService {
    User findById(Long userId);
    UserResponse findResponseById(Long userId);
}
