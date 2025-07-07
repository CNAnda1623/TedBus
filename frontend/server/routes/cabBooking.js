const express = require('express');
const router = express.Router();
const { createCabBooking } = require('../controller/cabBooking');

router.post('/cab-booking', createCabBooking);

module.exports = router;
