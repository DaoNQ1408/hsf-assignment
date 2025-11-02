package com.hsf.assignment.controller;

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
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<List<ApplicationResponse>> getByAuthor() {
        return ResponseEntity.ok(applicationService.getByAuthor());
    }


    @GetMapping("/by-receiver")
    @PreAuthorize("hasAuthority('USER')")
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
            @PathVariable Long id,
            @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.updateUserApplication(id,request));
    }


//    @PutMapping()
//    public ResponseEntity<ApplicationResponse> updateApplication(
//            @PathVariable Long id,
//            @RequestBody ApplicationUpdateRequest request
//    ){
//        return ResponseEntity.ok(applicationService.updateApplication(id,request));
//    }


    @GetMapping()
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAll());
    }


//    @GetMapping("except-user")
//    public ResponseEntity<List<ApplicationResponse>> getAllExceptUser() {
//        return ResponseEntity.ok(applicationService.getAllNotUser());
//    }


    @PutMapping("/adopted/{applicationId}/receiver/{receiverId}")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<ApplicationResponse> adoptedApplication(@PathVariable Long applicationId,
                                                                  @PathVariable Long receiverId) {
        return ResponseEntity.ok(applicationService.adoptedApplication(applicationId, receiverId));
    }


    @PutMapping("/hidden/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<ApplicationResponse> hideApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.hideApplication(id));
    }
}
