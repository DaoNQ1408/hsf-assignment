package com.hsf.assignment.mapper;
import com.hsf.assignment.Enum.UserRole;
import com.hsf.assignment.dto.request.ImageRequest;
import com.hsf.assignment.dto.response.ImageResponse;
import com.hsf.assignment.entity.Image;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.service.AccountService;
import com.hsf.assignment.service.PetService;
import org.mapstruct.*;


import java.util.List;

@Mapper (componentModel = "spring",
        uses = {PetService.class,
                AccountService.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
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
    Image toEntity(ImageRequest request);

    @Mapping(target = "pet", ignore = true)
    @Mapping(target = "user",source = "userId", qualifiedByName = "mapUserFromId")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(ImageRequest request, @MappingTarget Image image);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "pet", ignore = true)
    @Mapping(target = "imageId", ignore = true)
    @Mapping(target = "isDeleted", constant = "false")
    @Mapping(target = "imageType", constant = "USER")
    Image toUserImageEntity(ImageRequest request);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "pet", ignore = true)
    @Mapping(target = "imageId", ignore = true)
    @Mapping(target = "isDeleted", constant = "false")
    @Mapping(target = "imageType", constant = "PET")
    Image toPetImageEntity(ImageRequest request);

}
