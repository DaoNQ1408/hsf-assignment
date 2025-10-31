package com.hsf.assignment.controller;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.service.ApplicationService;
import com.hsf.assignment.service.impl.ApplicationServiceImpl;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/application")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@SecurityRequirement(name = "bearerAuth")
public class ApplicationController {

    ApplicationService applicationService;

//    @GetMapping()
//    public ResponseEntity<List<ApplicationResponse>> getApplication(){
//        Li
//    }

    @GetMapping("/forUser")
    public ResponseEntity<List<ApplicationResponse>> getByUser(
    ){
        List<ApplicationResponse> response = applicationService.getByUser();
        return ResponseEntity.ok(response);
    }


    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('USER')")
    public ResponseEntity<ApplicationResponse> createApplication(
            @RequestBody ApplicationRequest applicationRequest){
        ApplicationResponse response = applicationService.createApplication(applicationRequest);
        return ResponseEntity.ok(response);
    }




}
