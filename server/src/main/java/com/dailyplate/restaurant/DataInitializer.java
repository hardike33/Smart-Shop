package com.dailyplate.restaurant;

import com.dailyplate.restaurant.model.Rider;
import com.dailyplate.restaurant.repository.RiderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(RiderRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Rider r1 = new Rider();
                r1.setName("Rahul Kumar");
                r1.setPhotoUrl("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6");
                r1.setVehicleNumber("KA 01 J 1234");
                r1.setVehicleType("Bike");
                r1.setPhoneNumber("9876543210");
                r1.setAvailable(true);
                repository.save(r1);

                Rider r2 = new Rider();
                r2.setName("Amit Singh");
                r2.setPhotoUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d");
                r2.setVehicleNumber("KA 03 M 5678");
                r2.setVehicleType("Bike");
                r2.setPhoneNumber("9876543211");
                r2.setAvailable(true);
                repository.save(r2);

                Rider r3 = new Rider();
                r3.setName("Suresh Raina");
                r3.setPhotoUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e");
                r3.setVehicleNumber("KA 05 A 9012");
                r3.setVehicleType("Auto");
                r3.setPhoneNumber("9876543212");
                r3.setAvailable(true);
                repository.save(r3);

                Rider r4 = new Rider();
                r4.setName("Vicky Kaushal");
                r4.setPhotoUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e");
                r4.setVehicleNumber("KA 02 C 3456");
                r4.setVehicleType("Cab");
                r4.setPhoneNumber("9876543213");
                r4.setAvailable(true);
                repository.save(r4);
            }
        };
    }
}
