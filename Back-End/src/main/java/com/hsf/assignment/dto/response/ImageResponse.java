package com.hsf.assignment.dto.response;

import com.hsf.assignment.Enum.ImageType;
import com.hsf.assignment.Enum.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageResponse {
    private Long imageId;
    private String imageUrl;
    private ImageType imageType;
    private Long petId;
    private Long userId;
}
