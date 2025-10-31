package com.hsf.assignment.dto.response;

import lombok.Data;

@Data
public class PetResponse {
    private Long petId;
    private String petName;
    private int age;
    private int weight;
    private int height;
    private String species;
    private String sex;
    private String description;
    private Boolean vaccination;
}
