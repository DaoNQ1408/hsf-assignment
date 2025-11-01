package com.hsf.assignment.service.impl;

import com.hsf.assignment.dto.request.PetRequest;
import com.hsf.assignment.dto.response.PetResponse;
import com.hsf.assignment.entity.Pet;
import com.hsf.assignment.mapper.PetMapper;
import com.hsf.assignment.repository.PetRepository;
import com.hsf.assignment.service.ImageService;
import com.hsf.assignment.service.PetService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;
    private final PetMapper petMapper;
    private final ImageService imageService;


    @Override
    public List<PetResponse> getAll() {
        return petRepository.findAll()
                .stream()
                .map(petMapper::toResponse)
                .collect(Collectors.toList());
    }


    @Override
    public PetResponse getById(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng có id: " + id));
        return petMapper.toResponse(pet);
    }


    @Override
    @Transactional
    public PetResponse create(PetRequest request) {
        Pet pet = petMapper.toEntity(request);

        imageService.uploadPetImages(request.getImages(), pet);
        Pet saved = petRepository.save(pet);

        return petMapper.toResponse(saved);
    }


    @Override
    @Transactional
    public PetResponse update(Long id, PetRequest request) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng có id: " + id));

        petMapper.updateEntityFromRequest(pet, request);

        Pet updated = petRepository.save(pet);

        return petMapper.toResponse(updated);
    }


    @Override
    public Pet findById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Không tìm thấy thú cưng có id: " +
                                        id)
                );
    }


    @Override
    @Transactional
    public void delete(Long id) {
        if (!petRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy thú cưng có id: " + id);
        }
        petRepository.deleteById(id);
    }
}
