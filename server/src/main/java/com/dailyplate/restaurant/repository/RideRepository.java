package com.dailyplate.restaurant.repository;

import com.dailyplate.restaurant.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RideRepository extends JpaRepository<Ride, Long> {
}
