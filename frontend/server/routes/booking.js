// const express = require('express');
// const router = express.Router();
// const bookingController = require('../controller/booking');

// router.post('/booking', bookingController.addbooking);
// router.get('/booking/:id', bookingController.getBooking);
// module.exports = router;
// routes/booking.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controller/booking');

// Used like: POST /api/booking
router.post('/', bookingController.addbooking);
router.get('/:id', bookingController.getBooking);

module.exports = router;
