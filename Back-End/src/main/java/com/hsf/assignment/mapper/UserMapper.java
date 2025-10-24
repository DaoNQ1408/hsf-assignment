package com.hsf.assignment.mapper;
import com.hsf.assignment.dto.request.RegisterRequest;
import com.hsf.assignment.dto.response.RegisterResponse;
import com.hsf.assignment.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "role", expression = "java(com.hsf.assignment.Enum.UserRole.USER)")
    User toEntity(RegisterRequest request);

    RegisterResponse toRegisterResponse(User user);
}