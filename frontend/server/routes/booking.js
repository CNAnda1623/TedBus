const express = require('express');
const router = express.Router();
const bookingController = require('../controller/booking');

// Used like: POST /api/booking
router.post('/', bookingController.addbooking);
router.get('/:id', bookingController.getBooking);

module.exports = router;
