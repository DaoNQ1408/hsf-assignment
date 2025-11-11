package com.hsf.assignment.controller;

import com.hsf.assignment.dto.request.AdminUpdateRequest;
import com.hsf.assignment.dto.response.AdminResponse;
import com.hsf.assignment.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserController {
    private final UserService userService;

    @GetMapping("")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<AdminResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AdminResponse> getUserById(@PathVariable("id") Long id) {
    return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AdminResponse> updatedUser(
            @PathVariable Long id,
            @RequestBody AdminUpdateRequest request
            ) {
        AdminResponse response = userService.updatedUser(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AdminResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
