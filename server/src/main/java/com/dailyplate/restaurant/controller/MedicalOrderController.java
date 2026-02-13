package com.dailyplate.restaurant.controller;

import com.dailyplate.restaurant.model.MedicalOrder;
import com.dailyplate.restaurant.repository.MedicalOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Random;

@RestController
@RequestMapping("/api/medical")
@CrossOrigin(origins = "*")
public class MedicalOrderController {

    @Autowired
    private MedicalOrderRepository repository;

    @PostMapping("/order")
    public ResponseEntity<MedicalOrder> createOrder(@RequestBody MedicalOrder order) {
        order.setTokenNumber("TK-" + (1000 + new Random().nextInt(9000)));
        order.setStatus("PENDING");
        order.setOrderTime(LocalDateTime.now());
        return ResponseEntity.ok(repository.save(order));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<MedicalOrder> payOrder(@PathVariable Long id, @RequestParam String method) {
        MedicalOrder order = repository.findById(id).orElseThrow();
        order.setPaymentMethod(method);
        order.setStatus("PAID");
        return ResponseEntity.ok(repository.save(order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalOrder> getOrder(@PathVariable Long id) {
        return ResponseEntity.of(repository.findById(id));
    }
}
