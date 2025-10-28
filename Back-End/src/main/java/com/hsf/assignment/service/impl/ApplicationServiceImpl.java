package com.hsf.assignment.service.impl;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.entity.Application;
import com.hsf.assignment.mapper.ApplicationMapper;
import com.hsf.assignment.repository.ApplicationRepository;
import com.hsf.assignment.service.ApplicationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationServiceImpl implements ApplicationService {
    ApplicationMapper applicationMapper;
    ApplicationRepository applicationRepository;


    @Override
    public ApplicationResponse createApplication(ApplicationRequest applicationRequest) {
        Application application = applicationRepository.save(
                applicationMapper.toApplication(applicationRequest));
        return applicationMapper.toApplicationResponse(application);
    }
}
