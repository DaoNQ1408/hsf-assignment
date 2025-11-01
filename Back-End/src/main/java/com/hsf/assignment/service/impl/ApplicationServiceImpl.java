package com.hsf.assignment.service.impl;

import com.hsf.assignment.Enum.ApplicationStatus;
import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.request.ApplicationUpdateRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.dto.response.PetResponse;
import com.hsf.assignment.entity.Application;
import com.hsf.assignment.entity.Pet;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.mapper.ApplicationMapper;
import com.hsf.assignment.repository.ApplicationRepository;
import com.hsf.assignment.repository.PetRepository;
import com.hsf.assignment.service.ApplicationService;
import com.hsf.assignment.service.PetService;
import com.hsf.assignment.utils.UserUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class ApplicationServiceImpl implements ApplicationService {
    ApplicationMapper applicationMapper;
    ApplicationRepository applicationRepository;
    JwtServiceImpl  jwtServiceImpl;
    PetRepository petRepository;
    PetService petService;
    UserUtils userUtils;

    @Override
    public Application findById(long id) {
        return  applicationRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Application Not Found"));
    }

    @Override
    public List<Application> findAll() {
        return List.of();
    }

    @Override
    public List<ApplicationResponse> getByUser() {
        User user = userUtils.getCurrentUser();
        List<Application> lists = applicationRepository.findByAuthor(user);
        List<ApplicationResponse> listsResponse= lists.stream()
                .map(applicationMapper::toApplicationResponse)
                .collect(Collectors.toList());
        return listsResponse;
    }

    @Override
    @Transactional
    public ApplicationResponse createApplication(ApplicationRequest applicationRequest) {
        User user = userUtils.getCurrentUser();

        Pet pet = petRepository.findById(applicationRequest.getPetId())
                .orElseThrow(()-> new RuntimeException("Pet not found"));
        Application application = Application.builder()
                        .receiver(user)
                        .status(ApplicationStatus.AVAILABLE)
                        .pet(pet)
                        .build();

         application = applicationMapper.toApplication(applicationRequest);

         applicationRepository.save(application);

         return applicationMapper.toApplicationResponse(application);
    }

    @Override
    public ApplicationResponse userUpdateApplication(Long id,ApplicationRequest request) {
        Pet pet = petService.findById(request.getPetId());
        Application application = findById(id);
        application.setPet(pet);
        applicationRepository.save(application);
        return applicationMapper.toApplicationResponse(application);
    }

    @Override
    public String deleteApplication(Long id) {
        Application application = findById(id);
        applicationRepository.delete(application);
        return "Deleted application successfully" ;
    }

    @Override
    public ApplicationResponse updateApplication(Long id, ApplicationUpdateRequest request) {
        Application application = findById(id);
        applicationMapper.updateApplicationFromTarget(request,application);
        applicationRepository.save(application);
        return applicationMapper.toApplicationResponse(application);
    }



}
