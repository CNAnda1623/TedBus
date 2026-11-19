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

module.exports = router;
