package com.hsf.assignment.controller;

import com.hsf.assignment.dto.request.ImageRequest;
import com.hsf.assignment.dto.response.ImageResponse;
import com.hsf.assignment.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping(value = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<ImageResponse> upload(@RequestBody String imageRequest)
//            , @AuthenticationPrincipal UserDetails userDetails)
    {
       ImageResponse imageResponse = imageService.uploadUserImage(imageRequest);
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
    @PutMapping(value = "update/{id}")
    public ResponseEntity<ImageResponse> update(@PathVariable Long id, @ModelAttribute ImageRequest imageRequest) {
        return ResponseEntity.ok(imageService.update(id, imageRequest));
    }
    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        imageService.delete(id);
        return ResponseEntity.ok("Xóa thành công ảnh có id: " + id);
    }

}
