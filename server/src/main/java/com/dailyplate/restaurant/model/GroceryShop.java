package com.dailyplate.restaurant.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "grocery_shops")
@Data
public class GroceryShop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type; // Categories e.g. Organic, Dairy
    private Double rating;
    private String deliveryTime;
    private String distance;
    private String emoji;
    private String imageUrl;

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<GroceryItem> items;
}
