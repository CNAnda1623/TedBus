const mongoose = require('mongoose');

const cabCustomerSchema = new mongoose.Schema({
  name: String,
  gender: String,
  age: Number,
  time: {
    type: String,
    required: false
  },
  timeFormat: {
    type: String,  // Store AM/PM
    enum: ['AM', 'PM'],
    required: false
  },
  email: String,
  phone: String,
  insurance: Boolean,
  business: Boolean,
  whatsappUpdates: Boolean
}, {
  timestamps: true
});

module.exports = mongoose.models.CabCustomer || mongoose.model('CabCustomer', cabCustomerSchema);
