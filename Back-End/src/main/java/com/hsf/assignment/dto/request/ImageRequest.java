package com.hsf.assignment.dto.request;

import com.hsf.assignment.Enum.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageRequest {
    private String imageUrl;
    private long userId;
    private long petId;
    private String role;
}
