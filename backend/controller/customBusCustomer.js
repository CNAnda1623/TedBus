const CustomBusCustomer = require('../models/CustomBusCustomer');

exports.saveBusCustomer = async (req, res) => {
  try {
    const customer = new CustomBusCustomer(req.body);
    await customer.save();
    res.status(201).json({ message: 'Custom bus customer saved successfully', savedCustomer: customer });
  } catch (err) {
    console.error('Error saving custom bus customer:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
