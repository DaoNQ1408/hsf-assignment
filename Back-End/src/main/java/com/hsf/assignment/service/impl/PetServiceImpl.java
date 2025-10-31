package com.hsf.assignment.service.impl;

import com.hsf.assignment.dto.request.PetRequest;
import com.hsf.assignment.dto.response.PetResponse;
import com.hsf.assignment.entity.Pet;
import com.hsf.assignment.repository.PetRepository;
import com.hsf.assignment.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;

    @Override
    public List<PetResponse> getAll() {
        return petRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PetResponse getById(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng có id: " + id));
        return toResponse(pet);
    }

    @Override
    public PetResponse create(PetRequest request) {
        Pet pet = toEntity(request);
        Pet saved = petRepository.save(pet);
        return toResponse(saved);
    }

    @Override
    public PetResponse update(Long id, PetRequest request) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng có id: " + id));


        pet.setPetName(request.getPetName());
        pet.setAge(request.getAge());
        pet.setWeight(request.getWeight());
        pet.setHeight(request.getHeight());
        pet.setSpecies(request.getSpecies());
        pet.setSex(request.getSex());
        pet.setDescription(request.getDescription());
        pet.setVaccination(request.getVaccination());

        Pet updated = petRepository.save(pet);
        return toResponse(updated);
    }

    @Override
    public void delete(Long id) {
        if (!petRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy thú cưng có id: " + id);
        }
        petRepository.deleteById(id);
    }


    private Pet toEntity(PetRequest request) {
        return Pet.builder()
                .petName(request.getPetName())
                .age(request.getAge())
                .weight(request.getWeight())
                .height(request.getHeight())
                .species(request.getSpecies())
                .sex(request.getSex())
                .description(request.getDescription())
                .vaccination(request.getVaccination())
                .build();
    }


    private PetResponse toResponse(Pet pet) {
        PetResponse response = new PetResponse();
        response.setPetId(pet.getPetId());
        response.setPetName(pet.getPetName());
        response.setAge(pet.getAge());
        response.setWeight(pet.getWeight());
        response.setHeight(pet.getHeight());
        response.setSpecies(pet.getSpecies());
        response.setSex(pet.getSex());
        response.setDescription(pet.getDescription());
        response.setVaccination(pet.getVaccination());
        return response;
    }
}
