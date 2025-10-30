package com.hsf.assignment.mapper;

import com.hsf.assignment.dto.request.ImageRequest;
import com.hsf.assignment.dto.response.ImageResponse;
import com.hsf.assignment.entity.Image;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper (componentModel = "spring")
public interface ImageMapper {
    ImageMapper INSTANCE = Mappers.getMapper(ImageMapper.class);

    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "pet.petId", target = "petId")
    ImageResponse toResponse(Image image);

    List<ImageResponse> toResponseList(List<Image> images);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "pet", ignore = true)
    @Mapping(target = "imageId", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "imageType", ignore = true)
    @Mapping(target = "role", expression = "java(UserRole.valueOf(request.getRole().toUpperCase()))")
    Image toEntity(ImageRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(ImageRequest request, @MappingTarget Image image);




}
