package com.hsf.assignment.dto.request;

import com.hsf.assignment.Enum.PetSpecies;
import lombok.Data;
import lombok.NonNull;

import java.util.List;

@Data
public class PetRequest {
    @NonNull
    private String petName;
    @NonNull
    private int age;
    @NonNull
    private int weight;
    @NonNull
    private int height;

    private PetSpecies species;
    @NonNull
    private String sex;
    private String description;
    private Boolean vaccination;
    private List<ImageRequest> images;
}
