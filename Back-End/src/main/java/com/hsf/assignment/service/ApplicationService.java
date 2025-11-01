package com.hsf.assignment.service;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.request.ApplicationUpdateRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.entity.Application;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ApplicationService {

    Application findById(long id);

    List<Application> findAll();

    ApplicationResponse createApplication(ApplicationRequest applicationRequest);

    List<ApplicationResponse> getByUser();

    ApplicationResponse userUpdateApplication(Long id,ApplicationRequest request);

    String deleteApplication(Long id);

    ApplicationResponse updateApplication(Long id, ApplicationUpdateRequest request);
}
