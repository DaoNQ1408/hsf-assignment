package com.hsf.assignment.controller;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.request.ApplicationUpdateRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.service.impl.ApplicationServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/application")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationController {

    ApplicationServiceImpl applicationServiceImpl;


    @GetMapping("/user")
    public ResponseEntity<List<ApplicationResponse>> getByUser(
            @RequestHeader("Authorization") String token
    ){
        List<ApplicationResponse> response = applicationServiceImpl.getByUser(token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/user")
    public ResponseEntity<ApplicationResponse> createApplication(
            @RequestBody ApplicationRequest applicationRequest,
            @RequestHeader("Authorization") String token
            ){
        ApplicationResponse response = applicationServiceImpl.createApplication(applicationRequest,token);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationRequest request
            ){
        ApplicationResponse response = applicationServiceImpl.userUpdateApplication(id,request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteApplication(
            @PathVariable Long id
            ){
        String response = applicationServiceImpl.deleteApplication(id);
        return ResponseEntity.ok(response);
    }


//    @GetMapping
//    @PostMapping
    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationUpdateRequest request
    ){
        ApplicationResponse response = applicationServiceImpl.updateApplication(id,request);
        return ResponseEntity.ok(response);
    }



//    @PostMapping



}
