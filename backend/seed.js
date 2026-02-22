require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const GroceryShop = require('./models/GroceryShop');
const { MedicalShop } = require('./models/Medical');
const Ride = require('./models/Ride');

const MONGODB_URI = process.env.MONGODB_URI;

const restaurantsData = [
    // ... existing restaurants
    {
        id: '1',
        name: 'Sharma Kitchen',
        emoji: '🍛',
        imageUrl: 'https://images.unsplash.com/photo-1626777553767-463df4740f95',
        rating: 4.5,
        reviewCount: 234,
        cuisines: ['Home-Made', 'North Indian', 'Thali'],
        deliveryTime: '25-30 min',
        deliveryFee: 0,
        distance: '1.5 km',
        isHomeMade: true,
        priceRange: 1,
        menu: [
            { id: '1-1', name: 'Veg Thali', description: 'Roti, rice, dal, mixed veg curry, curd & pickle', price: 120, isVeg: true, isPopular: true, category: 'Thali' },
            { id: '1-2', name: 'Paneer Butter Masala', description: 'Creamy paneer curry with rich gravy', price: 150, isVeg: true, isPopular: true, category: 'Main Course' }
        ]
    },
    {
        id: '4',
        name: 'Biryani House',
        emoji: '🍚',
        imageUrl: 'https://images.unsplash.com/photo-1589302168068-1c459288350e',
        rating: 4.6,
        reviewCount: 567,
        cuisines: ['Biryani', 'Mughlai'],
        deliveryTime: '35-40 min',
        deliveryFee: 0,
        distance: '0.8 km',
        isHomeMade: false,
        priceRange: 2,
        menu: [
            { id: '4-1', name: 'Chicken Biryani', description: 'Aromatic basmati rice with tender chicken', price: 180, isVeg: false, isPopular: true, category: 'Biryani' }
        ]
    }
];

const groceryShopsData = [
    {
        id: 'organic-greens-hub',
        name: 'Organic Greens Hub',
        type: 'Organic • Fresh Produce',
        rating: 4.7,
        deliveryTime: '25 min',
        distance: '1.2 km',
        items: [
            { id: 'ogh-1', name: 'Tomato', price: 40, unit: '1kg', category: 'Vegetables' },
            { id: 'ogh-2', name: 'Onion', price: 35, unit: '1kg', category: 'Vegetables' }
        ]
    }
];

const medicalShopsData = [
    {
        id: 'med-1',
        name: 'Apollo Pharmacy',
        type: '24/7 Pharmacy',
        rating: 4.8,
        deliveryTime: '15-20 min',
        distance: '0.5 km',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a'
    },
    {
        id: 'med-2',
        name: 'MedPlus',
        type: 'Healthcare Store',
        rating: 4.5,
        deliveryTime: '20-30 min',
        distance: '1.2 km',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88'
    }
];

const ridesData = [
    {
        userId: 'demo_user',
        driverName: 'Rajesh Kumar',
        vehicleNumber: 'KA-01-AB-1234',
        vehicleType: 'Bike',
        pickup: 'Home',
        destination: 'Office',
        fare: 45,
        status: 'completed',
        otp: '1234'
    }
];

async function seedDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('🌱 Connected to MongoDB for seeding...');

        await Restaurant.deleteMany({});
        await Restaurant.insertMany(restaurantsData);
        console.log('✅ Restaurants seeded!');

        await GroceryShop.deleteMany({});
        await GroceryShop.insertMany(groceryShopsData);
        console.log('✅ Grocery Shops seeded!');

        await MedicalShop.deleteMany({});
        await MedicalShop.insertMany(medicalShopsData);
        console.log('✅ Medical Shops seeded!');

        await Ride.deleteMany({});
        await Ride.insertMany(ridesData);
        console.log('✅ Rides seeded!');

        await mongoose.disconnect();
        console.log('👋 Seeding complete. Disconnected.');
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
}

seedDB();
