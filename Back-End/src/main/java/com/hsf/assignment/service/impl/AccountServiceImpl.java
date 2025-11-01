package com.hsf.assignment.service.impl;

import com.hsf.assignment.dto.response.UserResponse;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.mapper.UserMapper;
import com.hsf.assignment.repository.UserRepository;
import com.hsf.assignment.service.AccountService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).get();
    }

    @Override
    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "User Not Found with ID: " +
                                        userId)
                );
    }

    @Override
    public UserResponse findResponseById(Long userId) {
        return userMapper.toUserResponse(findById(userId));
    }
}
