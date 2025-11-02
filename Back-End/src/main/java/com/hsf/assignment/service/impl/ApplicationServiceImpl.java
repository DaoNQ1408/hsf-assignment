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
import com.hsf.assignment.service.AccountService;
import com.hsf.assignment.service.ApplicationService;
import com.hsf.assignment.service.PetService;
import com.hsf.assignment.utils.UserUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class ApplicationServiceImpl implements ApplicationService {

    ApplicationMapper applicationMapper;
    ApplicationRepository applicationRepository;
    PetService petService;
    UserUtils userUtils;
    AccountService accountService;


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
    @Transactional
    public ApplicationResponse deleteApplication(Long applicationId) {
        Application application = findById(applicationId);

        applicationRepository.delete(application);

        return applicationMapper.toApplicationResponse(application);
    }

    @Override
    @Transactional
    public ApplicationResponse createApplication(ApplicationRequest applicationRequest) {
        User author = userUtils.getCurrentUser();

        Application application =  applicationMapper.toApplication(applicationRequest);
        application.setAuthor(author);
        application.setStatus(ApplicationStatus.AVAILABLE);

        applicationRepository.save(application);

        return applicationMapper.toApplicationResponse(application);
    }

    @Override
    @Transactional
    public ApplicationResponse updateUserApplication(Long id,ApplicationRequest request) {
        Pet pet = petService.findById(request.getPetId());
        Application application = findById(id);
        application.setApplicationContent(request.getApplicationContent());
        application.setPet(pet);
        applicationRepository.save(application);
        return applicationMapper.toApplicationResponse(application);
    }

    @Override
    public ApplicationResponse updateApplication(Long id ,ApplicationUpdateRequest request) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cannot find application with id: " + id));

        applicationMapper.updateEntity(application,request);

        return applicationMapper.toApplicationResponse(
                applicationRepository.save(application));
    }

    @Override
    public List<ApplicationResponse> getAllNotUser() {
        User user = userUtils.getCurrentUser();
        return applicationRepository.findByAuthorUserIdNot(user.getUserId()).stream()
                .map(applicationMapper::toApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationResponse> getAll() {
        return applicationRepository.findAll().stream()
                .map(applicationMapper::toApplicationResponse)
                .collect(Collectors.toList());
    }


    @Override
    @Transactional
    public ApplicationResponse adoptedApplication(Long applicationId, Long receiverId) {

        User owner = userUtils.getCurrentUser();
        Application application = findById(applicationId);
        User adopter = accountService.findById(receiverId);

        if(application.getAuthor() != owner) {
            throw new RuntimeException("Only the author of the application can mark it as adopted.");
        }

        if(application.getStatus() == ApplicationStatus.ADOPTED) {
            throw new RuntimeException("Application is already marked as adopted.");
        }

        application.setReceiver(adopter);
        application.setStatus(ApplicationStatus.ADOPTED);

        Application adoptedApplication = applicationRepository.save(application);

        return applicationMapper.toApplicationResponse(adoptedApplication);
    }

    @Override
    @Transactional
    public ApplicationResponse hideApplication(Long applicationId) {

        Application application = findById(applicationId);

        application.setStatus(ApplicationStatus.HIDDEN);
        Application hiddenApplication = applicationRepository.save(application);

        return applicationMapper.toApplicationResponse(hiddenApplication);
    }

}
