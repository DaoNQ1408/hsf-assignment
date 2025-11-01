package com.hsf.assignment.service.impl;

import com.hsf.assignment.dto.request.ImageRequest;
import com.hsf.assignment.dto.response.ImageResponse;
import com.hsf.assignment.entity.Image;
import com.hsf.assignment.entity.Pet;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.mapper.ImageMapper;
import com.hsf.assignment.repository.ImageRepository;
import com.hsf.assignment.service.ImageService;
import com.hsf.assignment.service.PetService;
import com.hsf.assignment.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ImgServiceImpl implements ImageService {

    private final ImageRepository imageRepo;
    private final ImageMapper imageMapper;
    private final UserUtils userUtils;
    private final PetService petService;


    @Override
    @Transactional
    public ImageResponse uploadUserImage(ImageRequest request) {
        try {
            User user = userUtils.getCurrentUser();
            Image image = imageMapper.toUserImageEntity(request);
            image.setUser(user);
            imageRepo.save(image);
            return imageMapper.toResponse(image);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lưu metadata ảnh: " + e.getMessage());
        }
    }


    @Override
    public ImageResponse getById(Long id) {
        Image image = imageRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không Tìm Thấy Ảnh"));
        return imageMapper.toResponse(image);
    }


    @Override
    public List<ImageResponse> getAll() {
       return  imageMapper.toResponseList(imageRepo.findAll());
    }


    @Override
    @Transactional
    public ImageResponse update(Long id, ImageRequest request) {
        try {
            Image image = imageRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy ảnh " ));
            imageMapper.updateEntityFromRequest(request, image);
            imageRepo.save(image);
            return imageMapper.toResponse(image);
        }catch (Exception ex) {
            ex.printStackTrace();
            throw  new RuntimeException("Lỗi Khi Cập Nhập Ảnh" + ex.getMessage());
        }
    }


    @Override
    @Transactional
    public void delete(Long id) {
           Image image = imageRepo.findById(id)
                   .orElseThrow(() -> new RuntimeException("Không Tìm Thấy Ảnh"));

           imageRepo.delete(image);

    }


    @Override
    public List<ImageResponse> getImageByUserId(Long userId) {
        return  imageMapper.toResponseList(imageRepo.findByUser_UserId(userId));
    }


    @Override
    public List<ImageResponse> getImageByPetId(Long petId) {
        return imageMapper.toResponseList(imageRepo.findByPet_PetId(petId));
    }


    @Override
    @Transactional
    public List<ImageResponse> uploadPetImages(List<ImageRequest> requests, Long petId) {
        List<ImageResponse> imageResponses = new ArrayList<>();

        for (ImageRequest request : requests) {
            ImageResponse response = uploadPetImage(request, petId);
            imageResponses.add(response);
        }

        return imageResponses;
    }


    @Transactional
    public ImageResponse uploadPetImage(ImageRequest request, Long petId) {
        try {
            Pet pet = petService.findById(petId);
            Image image = imageMapper.toPetImageEntity(request);
            image.setPet(pet);
            imageRepo.save(image);
            return imageMapper.toResponse(image);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lưu metadata ảnh: " + e.getMessage());
        }
    }
}
