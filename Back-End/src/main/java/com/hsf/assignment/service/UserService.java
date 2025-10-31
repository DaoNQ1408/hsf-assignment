package com.hsf.assignment.service;

import com.hsf.assignment.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> getAllUsers();

    Optional<User> getUserById(Long id);

    User getUserByEmail(String email);
    User getUserByPhone(String phone);

    List<User> getUsersByRole(String role);
    List<User> getUsersByStatus(String status);


    boolean updatePhone(Long id, String phone);
    boolean updateEmail(Long id, String email);
    boolean updatePassword(Long id, String password);
    boolean updateStatus(Long id, String status);

}
