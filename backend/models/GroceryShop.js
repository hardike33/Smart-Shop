const mongoose = require('mongoose');

const GroceryItemSchema = new mongoose.Schema({
    id: String,
    name: { type: String, required: true },
    image: String,
    price: { type: Number, required: true },
    unit: String,
    category: String
});

const GroceryShopSchema = new mongoose.Schema({
    id: String,
    name: { type: String, required: true },
    type: String,
    rating: { type: Number, default: 0 },
    deliveryTime: String,
    distance: String,
    image: String,
    items: [GroceryItemSchema]
});

module.exports = mongoose.model('GroceryShop', GroceryShopSchema);
