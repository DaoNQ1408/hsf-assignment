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
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationServiceImpl implements ApplicationService {
    ApplicationMapper applicationMapper;
    ApplicationRepository applicationRepository;
    JwtServiceImpl  jwtServiceImpl;
    PetRepository petRepository;


    @Override
    public List<ApplicationResponse> getByUser(String token) {
        User user = jwtServiceImpl.getUserByToken(token);
//        List<Application> list = applicationRepository.findByUser(user);
        List<ApplicationResponse> lists = new ArrayList<>();

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
}
