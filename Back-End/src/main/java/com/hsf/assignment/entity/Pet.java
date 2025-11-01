package com.hsf.assignment.entity;

import com.hsf.assignment.Enum.PetSpecies;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long petId;

    @Column(name = "pet_name")
    private String petName;

    @Column(name = "age")
    private int age;

    @Column(name = "weight")
    private int weight;

    @Column(name = "height")
    private int height;

    @Column(name = "species")
    private PetSpecies species;

    @Column(name = "sex")
    private String sex;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "vaccination")
    private Boolean vaccination;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    private List<Image> images;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    private List<Application> applications;
}
