package com.hsf.assignment.mapper;

import com.hsf.assignment.dto.request.ApplicationRequest;
import com.hsf.assignment.dto.response.ApplicationResponse;
import com.hsf.assignment.entity.Application;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {
    Application toApplication(ApplicationRequest applicationRequest);
    ApplicationResponse toApplicationResponse(Application application);
}
