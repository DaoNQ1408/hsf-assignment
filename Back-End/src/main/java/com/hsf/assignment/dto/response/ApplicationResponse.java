package com.hsf.assignment.dto.response;

import com.hsf.assignment.Enum.ApplicationStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationResponse {
    Long applicationId;
    PetResponse pet;
    String applicationContent;
    ApplicationStatus status;
    LocalDateTime createdAt;
    UserResponse author;
    UserResponse receiver;
}
