package com.dailyplate.restaurant.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "food_orders")
public class FoodOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String itemsJson;

    private Double subtotal;
    private Double deliveryCharge;
    private Double gst;
    private Double platformFee;
    private Double discount;
    private Double total;
    private String status;
    private String deliveryOtp;
    private String estimatedTime;
    private String deliveryAddress;
    private String paymentMethod;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
