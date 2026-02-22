const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');

// --- Restaurants ---
router.get('/restaurants', appController.getAllRestaurants);

// --- Groceries ---
router.get('/groceries/shops', appController.getAllGroceryShops);

// --- Medical ---
router.get('/medical/shops', appController.getAllMedicalShops);

// --- Rides ---
router.post('/rides/request', appController.createRideRequest);
router.get('/rides/history', async (req, res) => {
    try {
        const Ride = require('../models/Ride');
        const history = await Ride.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
