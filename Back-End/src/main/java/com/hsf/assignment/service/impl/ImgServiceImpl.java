package com.hsf.assignment.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hsf.assignment.Enum.UserRole;
import com.hsf.assignment.dto.request.ImageRequest;
import com.hsf.assignment.dto.response.ImageResponse;
import com.hsf.assignment.entity.Image;
import com.hsf.assignment.entity.Pet;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.repository.ImageRepository;
import com.hsf.assignment.repository.UserRepository;
import com.hsf.assignment.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ImgServiceImpl implements ImageService {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ImageRepository imageRepo;
//    @Autowired
//    private PetRepository petRepo;

    private Cloudinary cloudinary;

    public ImgServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    private ImageResponse mapToResponse(com.hsf.assignment.entity.Image image) {
        return ImageResponse.builder()
                .imageId(image.getImageId())
                .imageUrl(image.getImageUrl())
                .role(image.getRole())
                .imageType(image.getImageType())
                .userId(image.getUser() != null ? image.getUser().getUserId() : null)
                .build();
    }

    @Override
    public ImageResponse uploadImage(ImageRequest request) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    request.getFile().getBytes(),
                    ObjectUtils.asMap("folder", "pet-adoption")
            );
            String imageUrl = uploadResult.get("secure_url").toString();
            String imageType = uploadResult.get("resource_type").toString();

            User user = userRepo.findByUserId(request.getUserId());
            Pet pet = null;
            Image image = Image.builder()
                    .imageUrl(imageUrl)
                    .role(UserRole.valueOf(request.getRole().toUpperCase()))
                    .imageType(imageType)
                    .isDeleted(false)
                    .user(user)
//                    .pet(pet)
                    .build();
            imageRepo.save(image);
            return mapToResponse(image);
        } catch (Exception ex) {
            throw new RuntimeException("Có lỗi xảy ra: Error uploading image to Cloudinary");
        }
    }

    @Override
    public ImageResponse getById(Long id) {
        Image image = imageRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không Tìm Thấy Ảnh"));
        return mapToResponse(image);
    }
    @Override
    public List<ImageResponse> getAll() {
        return imageRepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    @Override
    public ImageResponse update(Long id, ImageRequest request) {
        try {
            Image image = imageRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy ảnh với id: " + id));

            if (request.getFile() != null && !request.getFile().isEmpty()) {
                Map uploadResult = cloudinary.uploader().upload(
                        request.getFile().getBytes(),
                        ObjectUtils.asMap("folder", "pet-adoption")
                );
                String imageUrl = uploadResult.get("secure_url").toString();
                String imageType = uploadResult.get("resource_type").toString();

                image.setImageUrl(imageUrl);
                image.setImageType(imageType);
                if(image.getRole() != null){
                    image.setRole(image.getRole());
                }
//                if (request.getPetId() != 0) {
//                    Pet pet = petRepo.findByPetId(request.getPetId());
//                    image.setPet(pet);
//                }

            }
            imageRepo.save(image);
            return mapToResponse(image);
        }catch (Exception ex) {
            ex.printStackTrace();
            throw  new RuntimeException("Lỗi Khi Cập Nhập Ảnh" + ex.getMessage());
        }
    }

    @Override
    public void delete(Long id) {
           Image image = imageRepo.findById(id)
                   .orElseThrow(() -> new RuntimeException("Không Tìm Thấy Ảnh"));

           imageRepo.delete(image);

    }

    @Override
    public List<ImageResponse> getImageByUserId(Long userId) {
        List<Image> images = imageRepo.findByUser_UserId(userId);
        return images.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
