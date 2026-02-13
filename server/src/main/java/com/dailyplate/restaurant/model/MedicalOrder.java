package com.dailyplate.restaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_orders")
@Data
public class MedicalOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shopName;
    private String shopAddress;
    private String serviceType; // Medicine purchase, Lab test, Doctor consultation, Other
    private String medicineNames;
    private Integer quantity;
    private String tokenNumber;
    private Double medicinePrice;
    private Double serviceCharge;
    private Double tokenFee;
    private Double totalAmount;
    private String paymentMethod;
    private String status; // PENDING, PAID, CONFIRMED
    private LocalDateTime orderTime = LocalDateTime.now();
    private String contactDetails;
}
