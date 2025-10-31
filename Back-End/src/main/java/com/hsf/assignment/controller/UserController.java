package com.hsf.assignment.controller;

import com.hsf.assignment.entity.User;
import com.hsf.assignment.service.impl.UserServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("/user")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserServiceImpl userServiceImpl;

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userServiceImpl.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userServiceImpl.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userServiceImpl.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<User> getUserByPhone(@PathVariable String phone) {
        User user = userServiceImpl.getUserByPhone(phone);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        List<User> users = userServiceImpl.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<User>> getUsersByStatus(@PathVariable String status) {
        List<User> users = userServiceImpl.getUsersByStatus(status);
        return ResponseEntity.ok(users);
    }


    @PutMapping("/{id}/phone")
    public ResponseEntity<String> updatePhone(@PathVariable Long id, @RequestParam String phone) {
        boolean updated = userServiceImpl.updatePhone(id, phone);
        return updated ? ResponseEntity.ok("Phone updated successfully.")
                : ResponseEntity.badRequest().body("Failed to update phone.");
    }

    @PutMapping("/{id}/email")
    public ResponseEntity<String> updateEmail(@PathVariable Long id, @RequestParam String email) {
        boolean updated = userServiceImpl.updateEmail(id, email);
        return updated ? ResponseEntity.ok("Email updated successfully.")
                : ResponseEntity.badRequest().body("Failed to update email.");
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<String> updatePassword(@PathVariable Long id, @RequestParam String password) {
        boolean updated = userServiceImpl.updatePassword(id, password);
        return updated ? ResponseEntity.ok("Password updated successfully.")
                : ResponseEntity.badRequest().body("Failed to update password.");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestParam String status) {
        boolean updated = userServiceImpl.updateStatus(id, status);
        return updated ? ResponseEntity.ok("Status updated successfully.")
                : ResponseEntity.badRequest().body("Failed to update status.");
    }
}
