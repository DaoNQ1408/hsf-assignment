package com.hsf.assignment.mapper;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.request.ApplicationUpdateRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.entity.Application;
import com.hsf.assignment.entity.Pet;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.service.AccountService;
import com.hsf.assignment.service.PetService;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        uses = {UserMapper.class,
                PetMapper.class,
                AccountService.class,
                PetService.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ApplicationMapper {

    @Mapping(target = "receiver", ignore = true)
    @Mapping(target = "pet", source = "petId", qualifiedByName = "mapPet")
    Application toApplication(ApplicationRequest applicationRequest);

    @Mapping(target = "pet", source = "pet")
    @Mapping(target = "author", source = "author")
    @Mapping(target = "receiver", source = "receiver")
    ApplicationResponse toApplicationResponse(Application application);

    @Mapping(target = "pet", source = "petId", qualifiedByName = "mapPet")
    @Mapping(target = "author", source = "authorId", qualifiedByName = "mapUser")
    @Mapping(target = "receiver", source = "receiverId", qualifiedByName = "mapUser")
    void updateEntity(@MappingTarget Application application,ApplicationUpdateRequest request);

    @Named("mapPet")
    default Pet mapPet(Long petId) {
        if (petId == null) return null;
        Pet pet = new Pet();
        pet.setPetId(petId);
        return pet;
    }

    @Named("mapUser")
    default User mapUser(Long userId) {
        if (userId == null) return null;
        User user = new User();
        user.setUserId(userId);
        return user;
    }
}
