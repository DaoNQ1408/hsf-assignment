package com.hsf.assignment.service;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.entity.Application;
import org.springframework.stereotype.Service;

@Service
public interface ApplicationService {
    public ApplicationResponse createApplication(ApplicationRequest applicationRequest);
}
