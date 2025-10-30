package com.hsf.assignment.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hsf.assignment.dto.request.ImageRequest;
import com.hsf.assignment.dto.response.ImageResponse;
import com.hsf.assignment.entity.Image;
import com.hsf.assignment.entity.Pet;
import com.hsf.assignment.entity.User;
import com.hsf.assignment.mapper.ImageMapper;
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
    @Autowired
    private ImageMapper imageMapper;

    private Cloudinary cloudinary;

    public ImgServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
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
            Image image = imageMapper.toEntity(request);
            image.setUser(user);
            image.setImageUrl(imageUrl);
            image.setImageType(imageType);
            image.setIsDeleted(false);

            imageRepo.save(image);
            return imageMapper.toResponse(image);
        } catch (Exception ex) {
            throw new RuntimeException("Lỗi upload image",ex);
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
    public ImageResponse update(Long id, ImageRequest request) {
        try {
            Image image = imageRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy ảnh " ));

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
            return imageMapper.toResponse(image);
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
        return  imageMapper.toResponseList(imageRepo.findByUser_UserId(userId));
    }
}
