package com.hsf.assignment.service;

import com.hsf.assignment.dto.request.ImageRequest;
import com.hsf.assignment.dto.response.ImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
    ImageResponse uploadImage(ImageRequest request);
    ImageResponse getById(Long id);
    List<ImageResponse> getAll();
    ImageResponse update(Long id, ImageRequest request);
    void delete(Long id);

    List<ImageResponse> getImageByUserId(Long userId);

}
