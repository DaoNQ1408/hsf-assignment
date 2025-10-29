package com.hsf.assignment.mapper;
import com.hsf.assignment.dto.request.RegisterRequest;
import com.hsf.assignment.dto.response.LoginResponse;
import com.hsf.assignment.dto.response.RegisterResponse;
import com.hsf.assignment.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "role", expression = "java(com.hsf.assignment.Enum.UserRole.USER)")
    @Mapping(target = "status", expression = "java(com.hsf.assignment.Enum.UserStatus.ACTIVE)")
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "authorApplications", ignore = true)
    @Mapping(target = "applications", ignore = true)
    @Mapping(target = "receiverApplications", ignore = true)
    User toEntity(RegisterRequest request);

    RegisterResponse toRegisterResponse(User user);

    @Mapping(target = "token", ignore = true)
    LoginResponse toLoginResponse(User user);
}