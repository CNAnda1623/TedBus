const mongoose = require('mongoose');

const customBusCustomerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  age: Number,
  gender: String,
  time: String,
  timeFormat: String,
  busOptions: {
    busSize: String,
    routeType: String,
    stops: String,
    busType: String,
    amenities: [String]
  }
});

module.exports = mongoose.model('CustomBusCustomer', customBusCustomerSchema);
