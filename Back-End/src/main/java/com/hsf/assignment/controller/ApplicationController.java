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

import java.util.List;

@RequestMapping("/application")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationController {

    ApplicationServiceImpl applicationServiceImpl;

//    @GetMapping()
//    public ResponseEntity<List<ApplicationResponse>> getApplication(){
//        Li
//    }



    @PostMapping("/create")
    public ResponseEntity<ApplicationResponse> createApplication(
            @RequestBody ApplicationRequest applicationRequest,
            @RequestHeader("Authorization") String token
            ){
        ApplicationResponse response = applicationServiceImpl.createApplication(applicationRequest,token);
        return ResponseEntity.ok(response);
    }




}
