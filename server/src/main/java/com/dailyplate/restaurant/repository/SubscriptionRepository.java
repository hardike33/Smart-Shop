package com.dailyplate.restaurant.repository;

import com.dailyplate.restaurant.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<Subscription, String> {
}
