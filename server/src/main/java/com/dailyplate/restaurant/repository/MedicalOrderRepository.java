package com.dailyplate.restaurant.repository;

import com.dailyplate.restaurant.model.MedicalOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalOrderRepository extends JpaRepository<MedicalOrder, Long> {
}
