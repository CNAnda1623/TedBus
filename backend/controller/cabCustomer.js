const CabCustomer = require('../models/CabCustomer');

exports.createCustomer = async (req, res) => {
    try {
    console.log("Received cab customer data:", req.body); // ✅ log it

    const newCustomer = new CabCustomer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error saving customer:', error);
    res.status(500).json({ error: 'Failed to save cab customer' });
  }
};
