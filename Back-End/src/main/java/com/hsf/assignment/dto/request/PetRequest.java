package com.hsf.assignment.dto.request;

import lombok.Data;
import lombok.NonNull;

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

    private String species;
    @NonNull
    private String sex;
    private String description;
    private Boolean vaccination;
}
