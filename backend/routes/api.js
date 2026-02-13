const express = require('express');
const router = express.Router();

// Mock Data
let orders = [];
let user = {
    id: 'user_1',
    name: 'Dharanish M',
    email: 'dharanish@example.com',
    phone: '9876543210',
    dailyBudget: 250,
    walletBalance: 1250
};

const restaurants = [
    { id: '1', name: 'Biryani House', rating: 4.6, deliveryTime: '35-40 min', category: 'Biryani • Mughlai', distance: '0.8 km' },
    { id: '2', name: 'South Express', rating: 4.4, deliveryTime: '20-25 min', category: 'South Indian', distance: '3.2 km' },
    { id: '3', name: 'Sharma Kitchen', rating: 4.5, deliveryTime: '25-30 min', category: 'North Indian', distance: '1.5 km' },
];

const groceryShops = [
    { id: '1', name: 'Organic Greens Hub', type: 'Organic • Fresh Produce', rating: 4.7, deliveryTime: '25 min', distance: '1.2 km' },
    { id: '2', name: 'Fresh Grocery Mart', type: 'Staples • Essentials', rating: 4.5, deliveryTime: '30 min', distance: '1.8 km' },
];

// --- Restaurants ---
router.get('/restaurants', (req, res) => {
    res.json(restaurants);
});

// --- Groceries ---
router.get('/groceries/shops', (req, res) => {
    res.json(groceryShops);
});

// --- Orders ---
router.get('/orders', (req, res) => {
    res.json(orders);
});

router.post('/orders/create', (req, res) => {
    const newOrder = {
        id: 'ORD' + Math.floor(Math.random() * 1000000),
        createdAt: new Date(),
        ...req.body
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// --- User Profile ---
router.get('/user', (req, res) => {
    res.json(user);
});

router.post('/user/update', (req, res) => {
    user = { ...user, ...req.body };
    res.json(user);
});

// --- Subscription & Wallet ---
router.get('/subscription/balance', (req, res) => {
    res.json({ balance: user.walletBalance });
});

router.post('/subscription/topup', (req, res) => {
    const { amount } = req.body;
    user.walletBalance += parseFloat(amount);
    res.json({ balance: user.walletBalance });
});

// --- History ---
router.get('/history', (req, res) => {
    // For this demo, history is just all orders
    res.json(orders.filter(o => o.status === 'delivered' || o.status === 'completed'));
});

// --- Payments ---
router.post('/payments/process', (req, res) => {
    const { orderId, method, amount } = req.body;
    // Simulate successful payment
    res.json({
        success: true,
        transactionId: 'TXN' + Math.floor(Math.random() * 1000000),
        status: 'PAID'
    });
});

module.exports = router;
