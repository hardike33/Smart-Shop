package com.dailyplate.restaurant.repository;

import com.dailyplate.restaurant.model.Rider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RiderRepository extends JpaRepository<Rider, Long> {
    List<Rider> findByVehicleTypeAndAvailableTrue(String vehicleType);
}
