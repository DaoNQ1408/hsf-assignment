package com.hsf.assignment.service;

import com.hsf.assignment.dto.request.PetRequest;
import com.hsf.assignment.dto.response.PetResponse;

import java.util.List;

public interface PetService {
    List<PetResponse> getAll();
    PetResponse getById(Long id);
    PetResponse create(PetRequest request);
    PetResponse update(Long id, PetRequest request);
    void delete(Long id);
}
