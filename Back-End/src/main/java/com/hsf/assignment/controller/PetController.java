package com.hsf.assignment.controller;

import com.hsf.assignment.dto.request.PetRequest;
import com.hsf.assignment.dto.response.PetResponse;
import com.hsf.assignment.service.PetService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class PetController {

    private final PetService petService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<PetResponse>> getAllPets() {
        return ResponseEntity.ok(petService.getAll());
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<PetResponse> getPetById(@PathVariable Long id) {
        return ResponseEntity.ok(petService.getById(id));
    }


    @GetMapping("/my-pets")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<List<PetResponse>> getMyPets() {
        return ResponseEntity.ok(petService.getMyPet());
    }


    @PostMapping
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<PetResponse> createPet(@RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.create(request));
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<PetResponse> updatePet(@PathVariable Long id, @RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.update(id, request));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<String> deletePet(@PathVariable Long id) {
        petService.delete(id);
        return ResponseEntity.ok("Đã xóa thú cưng có id: " + id);
    }
}
