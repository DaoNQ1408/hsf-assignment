package com.hsf.assignment.dto.request;

import com.hsf.assignment.Enum.ApplicationStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class ApplicationUpdateRequest {
    Long petId;
    ApplicationStatus status;
    Long authorId;
    Long receiverId;
}
