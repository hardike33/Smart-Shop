package com.dailyplate.restaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
@Data
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pickupLocation;
    private String dropLocation;
    private String rideType; // Bike, Auto, Cab
    private Double fare;
    private String status; // BOOKED, PAID, ASSIGNED, COMPLETED
    private String paymentMethod; // UPI, WALLET, CASH, CARD
    private String callStatus; // IDLE, RINGING, CONNECTED, ENDED
    private LocalDateTime bookingTime = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "rider_id")
    private Rider rider;
}
