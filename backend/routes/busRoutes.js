const express = require('express');
const router = express.Router();
const { saveBusCustomer } = require('../controller/customBusCustomer');

router.post('/custom-bus-customer', saveBusCustomer);

module.exports = router;
