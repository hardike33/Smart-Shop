package com.dailyplate.restaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "restaurants")
@Data
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double rating;
    private String deliveryTime;
    private String imageUrl;
    private String category; // e.g. Indian, Healthy, Home-style, Fast food
    private Boolean isHomeMade;
    private Integer priceRange;
    private Integer deliveryFee;
    private String distance;
}
