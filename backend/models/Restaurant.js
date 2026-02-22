const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    id: String,
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
    isVeg: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    category: String
});

const RestaurantSchema = new mongoose.Schema({
    id: String,
    name: { type: String, required: true },
    emoji: String,
    imageUrl: String,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    cuisines: [String],
    deliveryTime: String,
    deliveryFee: { type: Number, default: 0 },
    distance: String,
    isHomeMade: { type: Boolean, default: false },
    priceRange: { type: Number, enum: [1, 2, 3], default: 1 },
    menu: [MenuItemSchema]
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
