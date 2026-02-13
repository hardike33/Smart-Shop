package com.dailyplate.restaurant.controller;

import com.dailyplate.restaurant.model.GroceryShop;
import com.dailyplate.restaurant.repository.GroceryShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groceries")
@CrossOrigin(origins = "http://localhost:5173")
public class GroceryController {

    @Autowired
    private GroceryShopRepository groceryShopRepository;

    @GetMapping("/shops")
    public List<GroceryShop> getAllShops() {
        return groceryShopRepository.findAll();
    }
}
