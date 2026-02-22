const Restaurant = require('../models/Restaurant');
const GroceryShop = require('../models/GroceryShop');
const { MedicalShop } = require('../models/Medical');
const Ride = require('../models/Ride');

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllGroceryShops = async (req, res) => {
    try {
        const shops = await GroceryShop.find();
        res.json(shops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllMedicalShops = async (req, res) => {
    try {
        const shops = await MedicalShop.find();
        res.json(shops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createRideRequest = async (req, res) => {
    try {
        const newRide = new Ride(req.body);
        await newRide.save();
        res.status(201).json(newRide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
