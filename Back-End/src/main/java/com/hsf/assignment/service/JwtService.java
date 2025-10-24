package com.hsf.assignment.service;

import com.hsf.assignment.entity.User;
import org.springframework.stereotype.Service;


@Service
public interface JwtService {
    String generateToken(User user);
    User getUserByToken(String token);

}
