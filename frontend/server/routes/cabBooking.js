// const express = require('express');
// const router = express.Router();
// const { createCabBooking } = require('../controller/cabBooking');

// router.post('/cab-booking', createCabBooking);

// module.exports = router;
// routes/cabBooking.js
const express = require('express');
const router = express.Router();
const { createCabBooking } = require('../controller/cabBooking');

// This route is used like: POST /api/cab-booking
router.post('/', createCabBooking);

module.exports = router;
