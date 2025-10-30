package com.hsf.assignment.dto.response;

import com.hsf.assignment.Enum.ApplicationStatus;
import com.hsf.assignment.entity.Pet;
import com.hsf.assignment.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationResponse {

    Pet pet;
    String information;
    ApplicationStatus status;
    LocalDateTime createdAt;
    User receiver;
}
