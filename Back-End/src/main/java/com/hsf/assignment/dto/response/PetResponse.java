package com.hsf.assignment.dto.response;

import com.hsf.assignment.Enum.PetSpecies;
import lombok.Data;

import java.util.List;

@Data
public class PetResponse {
    private Long petId;
    private String petName;
    private int age;
    private int weight;
    private int height;
    private PetSpecies species;
    private String sex;
    private String description;
    private Boolean vaccination;
    private List<String> imageUrls;
    private Long ownerId;
}
