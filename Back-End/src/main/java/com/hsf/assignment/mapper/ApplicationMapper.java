package com.hsf.assignment.mapper;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.entity.Application;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = PetMapper.class)
public interface ApplicationMapper {
    Application toApplication(ApplicationRequest applicationRequest);

    @Mapping(source = "pet", target = "petResponse")
    ApplicationResponse toApplicationResponse(Application application);
}
