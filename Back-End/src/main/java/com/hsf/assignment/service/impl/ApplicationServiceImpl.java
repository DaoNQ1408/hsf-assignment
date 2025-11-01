package com.hsf.assignment.service.impl;

import com.hsf.assignment.Enum.ApplicationStatus;
import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.entity.Application;
import com.hsf.assignment.entity.Pet;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.mapper.ApplicationMapper;
import com.hsf.assignment.repository.ApplicationRepository;
import com.hsf.assignment.repository.PetRepository;
import com.hsf.assignment.service.ApplicationService;
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
    PetRepository petRepository;
    UserUtils userUtils;


    @Override
    public List<ApplicationResponse> getByAuthor() {
        User author = userUtils.getCurrentUser();

        List<Application> list = applicationRepository.findByAuthor(author);

        return list.stream()
                .map(applicationMapper::toApplicationResponse)
                .toList();
    }

    @Override
    public List<ApplicationResponse> getByReceiver() {
        User receiver = userUtils.getCurrentUser();

        List<Application> list = applicationRepository.findByReceiver(receiver);

        return list.stream()
                .map(applicationMapper::toApplicationResponse)
                .toList();
    }

    @Override
    public Application findById(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found with id: " +
                                        applicationId)
                );
    }

    @Override
    public ApplicationResponse findResponseById(Long applicationId) {
        return applicationMapper.toApplicationResponse(findById(applicationId));
    }

    @Override
    public ApplicationResponse updateApplication(Long applicationId, ApplicationRequest applicationRequest) {
        return null;
    }

    @Override
    public ApplicationResponse deleteApplication(Long applicationId) {
        Application application = findById(applicationId);

        applicationRepository.delete(application);

        return applicationMapper.toApplicationResponse(application);
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
}
