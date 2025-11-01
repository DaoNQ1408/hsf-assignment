package com.hsf.assignment.service.impl;

import com.hsf.assignment.Enum.ApplicationStatus;
import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.request.ApplicationUpdateRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.entity.Application;
import com.hsf.assignment.entity.Pet;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.mapper.ApplicationMapper;
import com.hsf.assignment.repository.ApplicationRepository;
import com.hsf.assignment.repository.PetRepository;
import com.hsf.assignment.service.ApplicationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationServiceImpl implements ApplicationService {
    ApplicationService applicationService;
    ApplicationMapper applicationMapper;
    ApplicationRepository applicationRepository;
    JwtServiceImpl  jwtServiceImpl;
    PetRepository petRepository;
//    PetService petService;


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
    public List<ApplicationResponse> getByUser(String token) {
        User user = jwtServiceImpl.getUserByToken(token);
        List<ApplicationResponse> lists = applicationRepository.findAll().stream()
                .map(applicationMapper::toApplicationResponse)
                .collect(Collectors.toList());
        return lists;
    }

    @Override
    public ApplicationResponse createApplication(ApplicationRequest applicationRequest,String token) {
        String jwt = token.substring(7);
        User user = jwtServiceImpl.getUserByToken(jwt);
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
        Pet pet = perService.findById(request.getPetId());
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

    }
}
