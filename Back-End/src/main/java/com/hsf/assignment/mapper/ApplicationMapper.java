package com.hsf.assignment.mapper;

import com.hsf.assignment.Enum.PetSpecies;
import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.entity.Application;
import com.hsf.assignment.service.AccountService;
import com.hsf.assignment.service.PetService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        uses = {UserMapper.class,
                PetMapper.class,
                AccountService.class,
                PetService.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ApplicationMapper {

    @Mapping(target = "receiver", ignore = true)
    @Mapping(target = "pet", source = "petId")
    Application toApplication(ApplicationRequest applicationRequest);


    @Mapping(target = "pet", source = "pet")
    @Mapping(target = "author", source = "author")
    @Mapping(target = "receiver", source = "receiver")
    ApplicationResponse toApplicationResponse(Application application);
}
