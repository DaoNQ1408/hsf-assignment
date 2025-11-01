package com.hsf.assignment.controller;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.request.ApplicationUpdateRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.service.ApplicationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/application")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationController {

    ApplicationService applicationService;


    @PostMapping("/create")
    public ResponseEntity<ApplicationResponse> createApplication(@RequestBody ApplicationRequest request) {
        ApplicationResponse response = applicationService.createApplication(request);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/by-author")
    public ResponseEntity<List<ApplicationResponse>> getByAuthor() {
        return ResponseEntity.ok(applicationService.getByAuthor());
    }


    @GetMapping("/by-receiver")
    public ResponseEntity<List<ApplicationResponse>> getByReceiver() {
        return ResponseEntity.ok(applicationService.getByReceiver());
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.findResponseById(id));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApplicationResponse> deleteApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.deleteApplication(id));
    }

    @PutMapping("/by-user/{id}")
    public ResponseEntity<ApplicationResponse> updateUserApplication(
            @PathVariable Long id,
            @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.updateUserApplication(id,request));
    }

    @PutMapping()
    public ResponseEntity<ApplicationResponse> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationUpdateRequest request
    ){
        return ResponseEntity.ok(applicationService.updateApplication(id,request));
    }

    @GetMapping()
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAll());
    }

    @GetMapping("except-user")
    public ResponseEntity<List<ApplicationResponse>> getAllExceptUser() {
        return ResponseEntity.ok(applicationService.getAllNotUser());
    }
}
