const mongoose = require('mongoose');

const MedicalOrderSchema = new mongoose.Schema({
    userId: String,
    shopName: String,
    items: [{
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: Number,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const MedicalShopSchema = new mongoose.Schema({
    id: String,
    name: { type: String, required: true },
    type: { type: String, default: 'Pharmacy' },
    rating: { type: Number, default: 0 },
    deliveryTime: String,
    distance: String,
    isOpen: { type: Boolean, default: true },
    image: String
});

module.exports = {
    MedicalShop: mongoose.model('MedicalShop', MedicalShopSchema),
    MedicalOrder: mongoose.model('MedicalOrder', MedicalOrderSchema)
};
