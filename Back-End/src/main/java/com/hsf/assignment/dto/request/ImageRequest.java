package com.hsf.assignment.dto.request;

import com.hsf.assignment.Enum.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageRequest {
    private MultipartFile file;
    private long userId;
    private long petId;
    private String role;
}
