const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
    userId: String,
    driverName: String,
    vehicleNumber: String,
    vehicleType: { type: String, enum: ['Bike', 'Auto', 'Cab'] },
    pickup: String,
    destination: String,
    fare: Number,
    status: { type: String, enum: ['searching', 'confirmed', 'ongoing', 'completed'], default: 'searching' },
    otp: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', RideSchema);
