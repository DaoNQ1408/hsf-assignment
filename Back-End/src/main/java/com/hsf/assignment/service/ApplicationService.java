package com.hsf.assignment.service;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.request.ApplicationUpdateRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.entity.Application;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ApplicationService {
    ApplicationResponse createApplication(ApplicationRequest applicationRequest);
    List<ApplicationResponse> getByAuthor();
    List<ApplicationResponse> getByReceiver();
    Application findById (Long applicationId);
    ApplicationResponse findResponseById(Long applicationId);
    ApplicationResponse updateUserApplication(Long applicationId, ApplicationRequest applicationRequest);
    ApplicationResponse deleteApplication(Long applicationId);

    List<ApplicationResponse> getAllNotUser(Long id);
    List<ApplicationResponse> getAll();

    ApplicationResponse updateApplication(Long id ,ApplicationUpdateRequest request);
}
