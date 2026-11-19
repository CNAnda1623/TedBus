const CabBooking = require('../models/cabBooking');

exports.createCabBooking = async (req, res) => {
  try {
    const newBooking = new CabBooking(req.body);
    await newBooking.save();
    res.status(201).json({ message: 'Cab booking saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save cab booking' });
  }
};
