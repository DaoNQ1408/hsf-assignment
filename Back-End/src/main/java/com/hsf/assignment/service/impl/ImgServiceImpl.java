package com.hsf.assignment.service.impl;

import com.hsf.assignment.dto.request.ImageRequest;
import com.hsf.assignment.dto.response.ImageResponse;
import com.hsf.assignment.entity.Image;
import com.hsf.assignment.entity.Pet;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.mapper.ImageMapper;
import com.hsf.assignment.repository.ImageRepository;
import com.hsf.assignment.repository.PetRepository;
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
    private final PetRepository petRepo;


    @Override
    @Transactional
    public ImageResponse uploadUserImage(String url) {
        try {
            User user = userUtils.getCurrentUser();
            ImageRequest imageRequest = new ImageRequest(url);
            Image image = imageMapper.toUserImageEntity(imageRequest);
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
    public List<ImageResponse> uploadPetImages(List<String> urls, Pet pet) {

        List<Image> newImages = new ArrayList<>();

        for (String url : urls) {
            Image image = uploadPetImage(url, pet);
            newImages.add(image);
        }

        if (pet.getImages() == null) {
            pet.setImages(new ArrayList<>());
        } else {
            pet.getImages().clear();
        }
        pet.getImages().addAll(newImages);

        return imageMapper.toResponseList(newImages);
    }


    @Transactional
    public Image uploadPetImage(String url, Pet pet) {
        try {
            Image image = imageMapper.toPetImageEntity(url);
            image.setPet(pet);
            return image;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lưu metadata ảnh: " + e.getMessage());
        }
    }
}
