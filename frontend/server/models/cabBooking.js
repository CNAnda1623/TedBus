const mongoose = require('mongoose');

const cabBookingSchema = new mongoose.Schema({
  departure: String,
  arrival: String,
  date: String,
  cabSize: String,
  tripType: String,
  timePreference: String,
  facilities: [String]
});

module.exports = mongoose.model('CabBooking', cabBookingSchema);

