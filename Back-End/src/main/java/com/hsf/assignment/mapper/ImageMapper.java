package com.hsf.assignment.mapper;
import com.hsf.assignment.Enum.UserRole;
import com.hsf.assignment.dto.request.ImageRequest;
import com.hsf.assignment.dto.response.ImageResponse;
import com.hsf.assignment.entity.Image;
import com.hsf.assignment.entity.User;
import org.mapstruct.*;


import java.util.List;

@Mapper (componentModel = "spring")
public interface ImageMapper {

    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "pet.petId", target = "petId")
    ImageResponse toResponse(Image image);

    List<ImageResponse> toResponseList(List<Image> images);

    @Mapping(target = "user", source = "userId" , qualifiedByName = "mapUserFromId")
    @Mapping(target = "pet", ignore = true)
    @Mapping(target = "imageId", ignore = true)
    @Mapping(target = "isDeleted", constant = "false")
    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "imageType", constant = "image")
    @Mapping(target = "role", qualifiedByName = "mapRole")
    Image toEntity(ImageRequest request);

    @Mapping(target = "pet", ignore = true)
    @Mapping(target = "user",source = "userId", qualifiedByName = "mapUserFromId")
    @Mapping(target = "role", qualifiedByName = "mapRole")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(ImageRequest request, @MappingTarget Image image);

    @Named("mapRole")
    default UserRole mapRole (String role) {
        return role != null ? UserRole.valueOf(role.toUpperCase()) : null;
    }
    @Named("mapUserFromId")
    default User mapUserFromId(Long userId) {
        if (userId == null) return null;
        User user = new User();
        user.setUserId(userId);
        return user;
    }





}
