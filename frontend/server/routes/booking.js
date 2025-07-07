const express = require('express');
const router = express.Router();
const bookingController = require('../controller/booking');
const { createCabBooking } = require('../controller/booking');

router.post('/booking', bookingController.addbooking);
router.get('/booking/:id', bookingController.getBooking);
router.post('/cab-booking', createCabBooking);

module.exports = router;
