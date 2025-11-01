package com.hsf.assignment.mapper;

import com.hsf.assignment.dto.request.PetRequest;
import com.hsf.assignment.dto.response.PetResponse;
import com.hsf.assignment.entity.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        uses = {ImageMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PetMapper {

    @Mapping(target = "imageUrls", source = "images")
    PetResponse toResponse(Pet pet);


    @Mapping(target = "images", ignore = true)
    Pet toEntity(PetRequest petRequest);

    @Mapping(target = "images", ignore = true)
    void updateEntityFromRequest(@MappingTarget Pet pet,
                                PetRequest petRequest);
}
