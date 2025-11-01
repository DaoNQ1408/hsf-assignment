package com.hsf.assignment.service;

import com.hsf.assignment.dto.request.ImageRequest;
import com.hsf.assignment.dto.response.ImageResponse;
import com.hsf.assignment.entity.Pet;


import java.util.List;

public interface ImageService {
    ImageResponse uploadUserImage(ImageRequest request);
    List<ImageResponse> uploadPetImages(List<ImageRequest> requests, Pet pet);
    ImageResponse getById(Long id);
    List<ImageResponse> getAll();
    ImageResponse update(Long id, ImageRequest request);
    void delete(Long id);
    List<ImageResponse> getImageByUserId(Long userId);
    List<ImageResponse> getImageByPetId(Long petId);

}
