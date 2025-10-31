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
    public List<ApplicationResponse> getByUser() {
        User user = userUtils.getCurrentUser();
        List<Application> list = applicationRepository.findByAuthor(user);
        List<ApplicationResponse> lists = new ArrayList<>();

        return lists;
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
