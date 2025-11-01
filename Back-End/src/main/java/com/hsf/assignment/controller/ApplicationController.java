package com.hsf.assignment.controller;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.request.ApplicationUpdateRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.service.ApplicationService;
import com.hsf.assignment.service.impl.ApplicationServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/application")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationController {

    ApplicationService applicationService;

    @GetMapping("/user")
    public ResponseEntity<List<ApplicationResponse>> getByUser(
    ){
        List<ApplicationResponse> response = applicationService.getByUser();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/user")
    @PreAuthorize("hasAnyAuthority('USER')")
    public ResponseEntity<ApplicationResponse> createApplication(
            @RequestBody ApplicationRequest applicationRequest
            ){
        ApplicationResponse response = applicationService.createApplication(applicationRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationRequest request
            ){
        ApplicationResponse response = applicationService.userUpdateApplication(id,request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteApplication(
            @PathVariable Long id
            ){
        String response = applicationService.deleteApplication(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationUpdateRequest request
    ){
        ApplicationResponse response = applicationService.updateApplication(id,request);
        return ResponseEntity.ok(response);
    }







}
