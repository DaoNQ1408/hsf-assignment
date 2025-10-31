package com.hsf.assignment.service;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.entity.Application;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ApplicationService {
    public ApplicationResponse createApplication(ApplicationRequest applicationRequest);

    List<ApplicationResponse> getByUser();

//    ApplicationResponse getByUser(String token);
}
