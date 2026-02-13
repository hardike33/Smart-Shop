package com.dailyplate.restaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "subscriptions")
@Data
public class Subscription {
    @Id
    private String userId = "user_1"; // Static for demo
    private Double balance = 1000.0;
    private String planName = "Elite Rider";
    private Boolean active = true;
}
