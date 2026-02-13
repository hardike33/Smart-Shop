package com.dailyplate.restaurant.controller;

import com.dailyplate.restaurant.model.FoodOrder;
import com.dailyplate.restaurant.repository.FoodOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private FoodOrderRepository orderRepository;

    @PostMapping("/create")
    public ResponseEntity<FoodOrder> createOrder(@RequestBody FoodOrder order) {
        if (order.getStatus() == null) {
            order.setStatus("confirmed");
        }
        return ResponseEntity.ok(orderRepository.save(order));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FoodOrder>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodOrder> getOrderById(@PathVariable Long id) {
        return ResponseEntity.of(orderRepository.findById(id));
    }
}
