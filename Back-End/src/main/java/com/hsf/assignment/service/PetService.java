package com.hsf.assignment.service;

import com.hsf.assignment.dto.request.PetRequest;
import com.hsf.assignment.dto.response.PetResponse;
import com.hsf.assignment.entity.Pet;

import java.util.List;

public interface PetService {
    List<PetResponse> getAll();
    List<PetResponse> getMyPet();
    PetResponse getById(Long id);
    PetResponse create(PetRequest request);
    PetResponse update(Long id, PetRequest request);
    Pet findById(Long id);
    void delete(Long id);
}
