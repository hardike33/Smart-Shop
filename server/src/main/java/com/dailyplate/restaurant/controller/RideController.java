package com.dailyplate.restaurant.controller;

import com.dailyplate.restaurant.model.Ride;
import com.dailyplate.restaurant.model.Rider;
import com.dailyplate.restaurant.model.Subscription;
import com.dailyplate.restaurant.repository.RideRepository;
import com.dailyplate.restaurant.repository.RiderRepository;
import com.dailyplate.restaurant.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "*")
public class RideController {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private RiderRepository riderRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @PostMapping("/book")
    public ResponseEntity<Ride> bookRide(@RequestBody Ride ride) {
        ride.setStatus("BOOKED");
        ride.setBookingTime(LocalDateTime.now());
        return ResponseEntity.ok(rideRepository.save(ride));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<Ride> payForRide(@PathVariable Long id, @RequestParam String method) {
        Ride ride = rideRepository.findById(id).orElseThrow();
        ride.setPaymentMethod(method);
        ride.setStatus("PAID");
        rideRepository.save(ride);

        if ("subscription".equalsIgnoreCase(method)) {
            Subscription sub = subscriptionRepository.findById("user_1")
                    .orElseGet(() -> {
                        Subscription s = new Subscription();
                        return subscriptionRepository.save(s);
                    });
            if (sub.getBalance() >= ride.getFare()) {
                sub.setBalance(sub.getBalance() - ride.getFare());
                subscriptionRepository.save(sub);
            }
        }

        // Auto-assign rider after payment for simplicity in this demo
        return assignRider(id);
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<Ride> assignRider(@PathVariable Long id) {
        Ride ride = rideRepository.findById(id).orElseThrow();
        List<Rider> availableRiders = riderRepository.findByVehicleTypeAndAvailableTrue(ride.getRideType());

        if (!availableRiders.isEmpty()) {
            Rider assignedRider = availableRiders.get(new Random().nextInt(availableRiders.size()));
            ride.setRider(assignedRider);
            ride.setStatus("ASSIGNED");
            // assignedRider.setAvailable(false); // Can keep them available for demo
            // purposes
            return ResponseEntity.ok(rideRepository.save(ride));
        }

        ride.setStatus("SEARCHING_RIDER");
        return ResponseEntity.ok(rideRepository.save(ride));
    }

    @PostMapping("/{id}/call-status")
    public ResponseEntity<Ride> updateCallStatus(@PathVariable Long id, @RequestParam String status) {
        Ride ride = rideRepository.findById(id).orElseThrow();
        ride.setCallStatus(status);
        return ResponseEntity.ok(rideRepository.save(ride));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ride> getRideDetails(@PathVariable Long id) {
        return ResponseEntity.of(rideRepository.findById(id));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Ride> completeRide(@PathVariable Long id) {
        Ride ride = rideRepository.findById(id).orElseThrow();
        ride.setStatus("COMPLETED");
        return ResponseEntity.ok(rideRepository.save(ride));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Ride>> getActiveRides() {
        return ResponseEntity.ok(rideRepository.findAll().stream()
                .filter(r -> !"COMPLETED".equals(r.getStatus()))
                .toList());
    }

    @GetMapping("/history")
    public ResponseEntity<List<Ride>> getRideHistory() {
        return ResponseEntity.ok(rideRepository.findAll().stream()
                .filter(r -> "COMPLETED".equals(r.getStatus()))
                .toList());
    }

    @GetMapping("/balance")
    public ResponseEntity<Subscription> getBalance() {
        return ResponseEntity.ok(subscriptionRepository.findById("user_1")
                .orElseGet(() -> {
                    Subscription s = new Subscription();
                    return subscriptionRepository.save(s);
                }));
    }

    @GetMapping("/riders")
    public ResponseEntity<List<Rider>> getAllRiders() {
        return ResponseEntity.ok(riderRepository.findAll());
    }
}
