package com.hsf.assignment.controller;

import com.hsf.assignment.Enum.UserRole;
import com.hsf.assignment.dto.request.ImageRequest;
import com.hsf.assignment.dto.response.ImageResponse;
import com.hsf.assignment.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping(value = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<ImageResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam long userId,
//            @RequestParam(required = false) long petId,
//            @AuthenticationPrincipal UserDetails user,
            @RequestParam(required = false,defaultValue = "USER") String role)
    {

       ImageRequest imageRequest = new ImageRequest();
       imageRequest.setUserId(userId);
       imageRequest.setRole(role);
       imageRequest.setFile(file);

       ImageResponse imageResponse = imageService.uploadImage(imageRequest);
       return ResponseEntity.ok(imageResponse);
    }
    @GetMapping
    public ResponseEntity<List<ImageResponse>> getAll() {
        return ResponseEntity.ok(imageService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(imageService.getById(id));
    }
    @GetMapping("/user/{userid}")
    public ResponseEntity<List<ImageResponse>> getImageById(@RequestParam Long userId) {
        List<ImageResponse> images = imageService.getImageByUserId(userId);
        return ResponseEntity.ok(images);
    }
    @PutMapping(value = "update/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ImageResponse> update(
            @PathVariable Long id,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Long userId) {

        ImageRequest req =  new ImageRequest();
        req.setUserId(userId);
        req.setRole(role);
        req.setFile(file);
        return ResponseEntity.ok(imageService.update(id, req));
    }
    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        imageService.delete(id);
        return ResponseEntity.ok("Xóa thành công ảnh có id: " + id);
    }

}
