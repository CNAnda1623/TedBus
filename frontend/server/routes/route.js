const express = require('express');
const router = express.Router();
const routeController = require('../controller/route');

router.get("/routes/:departure/:arrival/:date",
    routeController.getoneroute
);
module.exports = router;