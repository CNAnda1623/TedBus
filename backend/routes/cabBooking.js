const express = require('express');
const router = express.Router();
const { createCabBooking } = require('../controller/cabBooking');
const CabBooking = require('../models/cabBooking');
const CabCustomer = require('../models/CabCustomer');

// This route is used like: POST /api/cab-booking
router.post('/', createCabBooking);
router.get('/latest-cab-booking', async (req, res) => {
  try {
    const latest = await CabBooking.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/latest-cab-customer', async (req, res) => {
  try {
    const latest = await CabCustomer.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payment', async (req, res) => {
  try {
    console.log('Cab payment received:', req.body);
    if (req.body.cabBookingId) {
      await CabBooking.findByIdAndUpdate(req.body.cabBookingId, { status: 'confirmed' });
    }
    res.status(200).json({ message: 'Cab payment processed successfully', payment: req.body });
  } catch (error) {
    console.error('Cab payment error:', error);
    res.status(500).json({ error: 'Failed to process cab payment' });
  }
});

module.exports = router;
