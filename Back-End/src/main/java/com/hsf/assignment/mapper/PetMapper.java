package com.hsf.assignment.mapper;

import com.hsf.assignment.dto.response.PetResponse;
import com.hsf.assignment.entity.Pet;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PetMapper {
    PetResponse toResponse(Pet pet);
}
