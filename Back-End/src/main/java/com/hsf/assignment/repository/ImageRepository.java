package com.hsf.assignment.repository;

import com.hsf.assignment.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByUser_UserId(Long userId);
    List<Image> findByPet_PetId(Long petId);
}