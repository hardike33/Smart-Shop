-- SmartShop Database Seed Data

-- Insert Shops
INSERT INTO shops (id, name, type, description, address, phone, email, rating, reviews, openingTime, closingTime, deliveryTime, minOrder, deliveryCharge, image, featured) VALUES
(1, 'Fresh Mart', 'grocery', 'Fresh groceries and daily essentials', '123 Main Street, Downtown', '+1-234-567-8901', 'info@freshmart.com', 4.5, 245, '08:00', '22:00', '30-45 mins', 500, 50, '/assets/grocery/freshmart.jpg', true),
(2, 'Pure Health Pharmacy', 'medical', 'Over-the-counter medicines and health products', '456 Health Avenue, Medical District', '+1-234-567-8902', 'support@purehealthpharmacy.com', 4.8, 512, '09:00', '21:00', '20-30 mins', 300, 40, '/assets/medical/purerx.jpg', true),
(3, 'Spice House', 'grocery', 'Premium spices and cooking ingredients', '789 Market Lane, Old City', '+1-234-567-8903', 'orders@spicehouse.com', 4.3, 178, '08:30', '20:30', '40-50 mins', 400, 60, '/assets/grocery/spicehouse.jpg', false),
(4, 'MediCare Plus', 'medical', 'Medicines, supplements, and wellness products', '321 Hospital Road, Healthcare Zone', '+1-234-567-8904', 'care@medicarepls.com', 4.6, 389, '24/7', '24/7', '15-25 mins', 250, 35, '/assets/medical/medicareplus.jpg', true),
(5, 'Organic Valley', 'grocery', '100% organic and pesticide-free products', '555 Green Lane, Suburbs', '+1-234-567-8905', 'hello@organicvalley.com', 4.7, 423, '08:00', '21:00', '35-45 mins', 600, 70, '/assets/grocery/organicvalley.jpg', true);

-- Insert Items for Fresh Mart (Shop ID: 1)
INSERT INTO items (id, shopId, name, category, price, originalPrice, quantity, description, rating, reviews, image, inStock, discount) VALUES
(1, 1, 'Fresh Tomatoes', 'Vegetables', 45, 60, '1 kg', 'Fresh, locally sourced tomatoes', 4.6, 89, '/assets/grocery/tomatoes.jpg', true, 25),
(2, 1, 'Organic Spinach', 'Vegetables', 35, 50, '500 g', 'Nutritious organic spinach', 4.4, 56, '/assets/grocery/spinach.jpg', true, 30),
(3, 1, 'Fresh Milk', 'Dairy', 65, 75, '1 L', 'Pure, pasteurized fresh milk', 4.8, 234, '/assets/grocery/milk.jpg', true, 13),
(4, 1, 'Whole Wheat Bread', 'Bakery', 55, 70, '400 g', 'Freshly baked whole wheat bread', 4.5, 145, '/assets/grocery/bread.jpg', true, 21),
(5, 1, 'Bananas (Bunch)', 'Fruits', 40, 50, '1 bunch (6-7)', 'Fresh, ripe yellow bananas', 4.3, 178, '/assets/grocery/bananas.jpg', true, 20);

-- Insert Items for Pure Health Pharmacy (Shop ID: 2)
INSERT INTO items (id, shopId, name, category, price, originalPrice, quantity, description, rating, reviews, image, inStock, discount) VALUES
(6, 2, 'Aspirin 500mg', 'Pain Relief', 45, 60, '10 tablets', 'Effective pain and fever relief', 4.7, 312, '/assets/medical/aspirin.jpg', true, 25),
(7, 2, 'Cough Syrup', 'Cold & Cough', 120, 150, '100 ml', 'Fast-acting cough relief syrup', 4.5, 201, '/assets/medical/coughsyrup.jpg', true, 20),
(8, 2, 'Multivitamin Tablets', 'Vitamins', 250, 350, '30 tablets', 'Daily multivitamin supplement', 4.6, 456, '/assets/medical/vitamins.jpg', true, 28),
(9, 2, 'First Aid Kit', 'First Aid', 399, 550, '1 kit', 'Complete home first aid kit', 4.8, 187, '/assets/medical/firstaid.jpg', true, 27),
(10, 2, 'Moisturizing Lotion', 'Skincare', 199, 280, '200 ml', 'Gentle moisturizing lotion', 4.4, 234, '/assets/medical/lotion.jpg', true, 28);

-- Insert Items for Spice House (Shop ID: 3)
INSERT INTO items (id, shopId, name, category, price, originalPrice, quantity, description, rating, reviews, image, inStock, discount) VALUES
(11, 3, 'Turmeric Powder', 'Spices', 150, 200, '200 g', 'Pure, high-quality turmeric powder', 4.7, 123, '/assets/grocery/turmeric.jpg', true, 25),
(12, 3, 'Cashews', 'Dry Fruits', 450, 600, '250 g', 'Premium quality raw cashews', 4.8, 89, '/assets/grocery/cashews.jpg', true, 25),
(13, 3, 'Basmati Rice', 'Grains', 280, 380, '1 kg', 'Premium long-grain basmati rice', 4.6, 267, '/assets/grocery/basmati.jpg', true, 26),
(14, 3, 'Moong Dal', 'Pulses', 120, 160, '500 g', 'Split moong beans', 4.5, 145, '/assets/grocery/moongdal.jpg', true, 25),
(15, 3, 'Coconut Oil', 'Oils', 220, 300, '500 ml', 'Pure, cold-pressed coconut oil', 4.7, 178, '/assets/grocery/coconutoil.jpg', true, 26);

-- Insert Items for MediCare Plus (Shop ID: 4)
INSERT INTO items (id, shopId, name, category, price, originalPrice, quantity, description, rating, reviews, image, inStock, discount) VALUES
(16, 4, 'Paracetamol 650mg', 'Prescription', 35, 50, '15 tablets', 'Pain and fever reducer', 4.6, 523, '/assets/medical/paracetamol.jpg', true, 30),
(17, 4, 'Blood Pressure Monitor', 'Medical Devices', 1200, 1600, '1 unit', 'Digital blood pressure monitor', 4.7, 234, '/assets/medical/bpmonitor.jpg', true, 25),
(18, 4, 'Vitamin D3 Supplement', 'Health Supplements', 180, 250, '30 tablets', 'Vitamin D3 1000 IU tablets', 4.5, 312, '/assets/medical/vitamind3.jpg', true, 28);

-- Insert Items for Organic Valley (Shop ID: 5)
INSERT INTO items (id, shopId, name, category, price, originalPrice, quantity, description, rating, reviews, image, inStock, discount) VALUES
(19, 5, 'Organic Apples', 'Organic Fruits', 180, 240, '1 kg', 'Fresh organic apples from the valley', 4.8, 201, '/assets/grocery/apples.jpg', true, 25),
(20, 5, 'Organic Carrots', 'Organic Vegetables', 80, 120, '1 kg', 'Fresh organic carrots', 4.6, 145, '/assets/grocery/carrots.jpg', true, 33),
(21, 5, 'Organic Whole Milk', 'Organic Dairy', 110, 150, '1 L', 'Pure organic cow milk', 4.7, 267, '/assets/grocery/organicmilk.jpg', true, 26),
(22, 5, 'Organic Wheat Flour', 'Organic Grains', 220, 300, '1 kg', 'Stone-ground organic wheat flour', 4.5, 178, '/assets/grocery/wheatflour.jpg', true, 26);
