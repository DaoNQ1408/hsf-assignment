package com.hsf.assignment.service.impl;

import com.cloudinary.Cloudinary;
import com.hsf.assignment.Enum.UserRole;
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



    @Override
    public ImageResponse uploadImage(ImageRequest request) {
        try {
            User user = userRepo.findByUserId(request.getUserId());
            Image image = imageMapper.toEntity(request);
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
