package com.hsf.assignment.controller;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.service.impl.ApplicationServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/application")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationController {

    ApplicationServiceImpl applicationServiceImpl;

    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @RequestBody ApplicationRequest applicationRequest
            ){
        ApplicationResponse response = applicationServiceImpl.createApplication(applicationRequest);
        return ResponseEntity.ok(response);
    }

}
