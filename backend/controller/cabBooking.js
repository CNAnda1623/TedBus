const CabBooking = require('../models/cabBooking');

exports.createCabBooking = async (req, res) => {
  try {
    const newBooking = new CabBooking(req.body);
    await newBooking.save();
    res.status(201).json({ message: 'Cab booking saved successfully', booking: newBooking });
  } catch (error) {
    console.error('Failed to save cab booking:', error);
    res.status(500).json({ error: 'Failed to save cab booking' });
  }
};
