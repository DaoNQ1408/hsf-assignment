package com.hsf.assignment.controller;

import com.hsf.assignment.Enum.ApplicationStatus;
import com.hsf.assignment.dto.request.AdoptRequest;
import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.service.ApplicationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@SecurityRequirement(name = "bearerAuth")
public class ApplicationController {

    ApplicationService applicationService;


    @PostMapping("/create")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<ApplicationResponse> createApplication(@RequestBody ApplicationRequest request) {
        ApplicationResponse response = applicationService.createApplication(request);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/by-author")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getByAuthor() {
        return ResponseEntity.ok(applicationService.getByAuthor());
    }


    @GetMapping("/by-receiver")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getByReceiver() {
        return ResponseEntity.ok(applicationService.getByReceiver());
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<ApplicationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.findResponseById(id));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<ApplicationResponse> deleteApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.deleteApplication(id));
    }


    @PutMapping("/by-author/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<ApplicationResponse> updateUserApplication(
            @PathVariable(name = "id") Long applicationId,
            @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.updateUserApplication(applicationId,request));
    }

    @PutMapping("/status/by-author/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable(name = "id") Long applicationId,
            @RequestBody ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId,status));
    }


//    @PutMapping()
//    public ResponseEntity<ApplicationResponse> updateApplication(
//            @PathVariable Long id,
//            @RequestBody ApplicationUpdateRequest request
//    ){
//        return ResponseEntity.ok(applicationService.updateApplication(id,request));
//    }


    @GetMapping()
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAll());
    }


//    @GetMapping("except-user")
//    public ResponseEntity<List<ApplicationResponse>> getAllExceptUser() {
//        return ResponseEntity.ok(applicationService.getAllNotUser());
//    }


    @PutMapping("/adopted/{applicationId}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<ApplicationResponse> adoptedApplication(@PathVariable Long applicationId,
                                                                  @RequestBody AdoptRequest request) {
        return ResponseEntity.ok(applicationService.adoptedApplication(applicationId, request));
    }


    @PutMapping("/hidden/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<ApplicationResponse> hideApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.hideApplication(id));
    }
}
