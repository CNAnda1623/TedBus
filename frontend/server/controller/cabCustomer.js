const CabCustomer = require('../models/CabCustomer');

exports.createCustomer = async (req, res) => {
    console.log("Received cab customer data:", req.body); // ✅ log it
  try {
    const newCustomer = new CabCustomer(req.body);
    await newCustomer.save();
    res.status(201).json({ message: 'Cab customer saved successfully' });
  } catch (error) {
    console.error('Error saving customer:', error);
    res.status(500).json({ error: 'Failed to save cab customer' });
  }
};
