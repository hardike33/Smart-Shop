CREATE DATABASE IF NOT EXISTS daily_plate_db;
USE daily_plate_db;

CREATE TABLE IF NOT EXISTS restaurants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating DOUBLE,
    delivery_time VARCHAR(50),
    image_url VARCHAR(2083),
    category VARCHAR(50),
    is_home_made BOOLEAN,
    price_range INT,
    delivery_fee INT,
    distance VARCHAR(50)
);

INSERT INTO restaurants (name, rating, delivery_time, image_url, category, is_home_made, price_range, delivery_fee, distance) VALUES
('Biryani House', 4.6, '35-40 min', 'https://images.unsplash.com/photo-1589302168068-1c459288350e', 'Biryani • Mughlai', false, 2, 15, '0.8 km'),
('South Express', 4.4, '20-25 min', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc', 'South Indian', false, 1, 25, '3.2 km'),
('Sharma Kitchen', 4.5, '25-30 min', 'https://images.unsplash.com/photo-1626777553767-463df4740f95', 'North Indian', true, 1, 0, '1.5 km'),
('Fresh Bites Cafe', 4.3, '25-30 min', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 'Healthy • Salads', false, 2, 30, '2.1 km'),
('Mama\'s Home Food', 4.8, '30-35 min', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe', 'Home-Style • Indian', true, 1, 15, '0.8 km');

CREATE TABLE IF NOT EXISTS grocery_shops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    rating DOUBLE,
    delivery_time VARCHAR(50),
    distance VARCHAR(50),
    emoji VARCHAR(10),
    image_url VARCHAR(2083)
);

CREATE TABLE IF NOT EXISTS grocery_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE,
    unit VARCHAR(50),
    image_url VARCHAR(2083),
    category VARCHAR(50),
    shop_id BIGINT,
    FOREIGN KEY (shop_id) REFERENCES grocery_shops(id)
);

INSERT INTO grocery_shops (name, type, rating, delivery_time, distance, emoji, image_url) VALUES
('Organic Greens Hub', 'Organic • Fresh Produce', 4.7, '25 min', '1.2 km', '🥬', 'https://images.unsplash.com/photo-1542838132-92c53300491e'),
('Fresh Grocery Mart', 'Staples • Essentials', 4.5, '30 min', '1.8 km', '🛒', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58'),
('Big Basket Express', 'Dairy • Breakfast', 4.6, '20 min', '0.8 km', '🧺', 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e'),
('Daily Needs Store', 'Household • Cleaning', 4.4, '35 min', '2.1 km', '🏠', 'https://images.unsplash.com/photo-1604719312563-861ac03fd89b');

-- Organic Greens Hub (Shop 1)
INSERT INTO grocery_items (name, price, unit, image_url, category, shop_id) VALUES
('Tomato', 40, '1kg', 'https://images.unsplash.com/photo-1518977676601-b53f02bad177', 'Vegetables', 1),
('Onion', 35, '1kg', 'https://images.unsplash.com/photo-1508747703725-719777637510', 'Vegetables', 1),
('Spinach', 20, '1 bunch', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb', 'Vegetables', 1),
('Apple', 120, '1kg', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6', 'Fruits', 1),
('Banana', 50, '1 dozen', 'https://images.unsplash.com/photo-1571771894821-ad9b588640ba', 'Fruits', 1);

-- Fresh Grocery Mart (Shop 2)
INSERT INTO grocery_items (name, price, unit, image_url, category, shop_id) VALUES
('Rice', 55, '1kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c', 'Staples', 2),
('Wheat Flour', 48, '1kg', 'https://images.unsplash.com/photo-1627485204598-9445ec59ca3a', 'Staples', 2),
('Cooking Oil', 140, '1L', 'https://images.unsplash.com/photo-1474979266404-7eaacabc88c5', 'Staples', 2),
('Sugar', 42, '1kg', 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635', 'Staples', 2);

-- Big Basket Express (Shop 3)
INSERT INTO grocery_items (name, price, unit, image_url, category, shop_id) VALUES
('Milk', 50, '1L', 'https://images.unsplash.com/photo-1563636619-e910fa4a373e', 'Dairy', 3),
('Bread', 35, '1 pack', 'https://images.unsplash.com/photo-1509440159596-0249088772ff', 'Bakery', 3),
('Eggs', 70, '12 pcs', 'https://images.unsplash.com/photo-1506976785307-8732e854ad03', 'Dairy', 3),
('Butter', 55, '100g', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d', 'Dairy', 3);

-- Daily Needs Store (Shop 4)
INSERT INTO grocery_items (name, price, unit, image_url, category, shop_id) VALUES
('Detergent', 95, '1kg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', 'Household', 4),
('Dish Wash', 60, '500ml', 'https://images.unsplash.com/photo-1585421514738-ee94bb58970a', 'Household', 4),
('Bath Soap', 75, '3 pcs', 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214', 'Personal Care', 4),
('Toothpaste', 85, '200g', 'https://images.unsplash.com/photo-1559591937-e6b7303e6f5f', 'Personal Care', 4);

CREATE TABLE IF NOT EXISTS riders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(2083),
    vehicle_number VARCHAR(50),
    vehicle_type VARCHAR(50),
    phone_number VARCHAR(20),
    available BOOLEAN DEFAULT TRUE
);

INSERT INTO riders (name, photo_url, vehicle_number, vehicle_type, phone_number) VALUES
('Rahul Kumar', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6', 'KA 01 J 1234', 'Bike', '9876543210'),
('Amit Singh', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'KA 03 M 5678', 'Bike', '9876543211'),
('Suresh Raina', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', 'KA 05 A 9012', 'Auto', '9876543212'),
('Vicky Kaushal', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', 'KA 02 C 3456', 'Cab', '9876543213');

CREATE TABLE IF NOT EXISTS rides (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pickup_location VARCHAR(255),
    drop_location VARCHAR(255),
    ride_type VARCHAR(50),
    fare DOUBLE,
    status VARCHAR(50),
    payment_method VARCHAR(50),
    booking_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    rider_id BIGINT,
    FOREIGN KEY (rider_id) REFERENCES riders(id)
);

CREATE TABLE IF NOT EXISTS medical_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shop_name VARCHAR(255),
    shop_address VARCHAR(255),
    service_type VARCHAR(100),
    medicine_names TEXT,
    quantity INT,
    token_number VARCHAR(50),
    medicine_price DOUBLE,
    service_charge DOUBLE,
    token_fee DOUBLE,
    total_amount DOUBLE,
    payment_method VARCHAR(50),
    status VARCHAR(50),
    order_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    contact_details VARCHAR(100)
);

