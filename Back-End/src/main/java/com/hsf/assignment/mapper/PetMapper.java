package com.hsf.assignment.mapper;

import com.hsf.assignment.dto.request.PetRequest;
import com.hsf.assignment.dto.response.PetResponse;
import com.hsf.assignment.entity.Pet;
import com.hsf.assignment.service.AccountService;
import com.hsf.assignment.service.ImageService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        uses = {ImageMapper.class,
                AccountService.class,
                ImageService.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PetMapper {

    @Mapping(target = "imageUrls", source = "images")
    @Mapping(target = "ownerId", source = "user.userId")
    PetResponse toResponse(Pet pet);


    @Mapping(target = "images", ignore = true)
    @Mapping(target = "user", source = "userId")
    Pet toEntity(PetRequest petRequest);

    @Mapping(target = "images", source = "imageUrls", qualifiedByName = "toPetImageEntity")
    void updateEntityFromRequest(@MappingTarget Pet pet,
                                PetRequest petRequest);
}
