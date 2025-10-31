package com.hsf.assignment.service.impl;

import com.hsf.assignment.entity.User;
import com.hsf.assignment.repository.UserRepository;
import com.hsf.assignment.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository; // Spring tự inject repository

    @Override
    public List<User> getAllUsers() {
        try {
            return userRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching all users: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<User> getUserById(Long id) {
        try {
            return Optional.ofNullable(userRepository.findByUserId(id));
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching user by ID: " + e.getMessage(), e);
        }
    }

    @Override
    public User getUserByEmail(String email) {
        try {
            return userRepository.findByEmail(email);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching user by email: " + e.getMessage(), e);
        }
    }

    @Override
    public User getUserByPhone(String phone) {
        try {
            return userRepository.findByPhone(phone);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching user by phone: " + e.getMessage(), e);
        }
    }

    @Override
    public List<User> getUsersByRole(String role) {
        try {
            return userRepository.findByRole(role);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching users by role: " + e.getMessage(), e);
        }
    }

    @Override
    public List<User> getUsersByStatus(String status) {
        try {
            return userRepository.findByStatus(status);
        } catch (Exception e) {
            throw new RuntimeException("Error while fetching users by status: " + e.getMessage(), e);
        }
    }



    @Override
    public boolean updatePhone(Long id, String phone) {
        try {
            return userRepository.updatePhone(id, phone) > 0;
        } catch (Exception e) {
            throw new RuntimeException("Error while updating phone: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean updateEmail(Long id, String email) {
        try {
            return userRepository.updateEmail(id, email) > 0;
        } catch (Exception e) {
            throw new RuntimeException("Error while updating email: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean updatePassword(Long id, String password) {
        try {
            return userRepository.updatePassword(id, password) > 0;
        } catch (Exception e) {
            throw new RuntimeException("Error while updating password: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean updateStatus(Long id, String status) {
        try {
            return userRepository.updateStatus(id, status) > 0;
        } catch (Exception e) {
            throw new RuntimeException("Error while updating status: " + e.getMessage(), e);
        }
    }
}
