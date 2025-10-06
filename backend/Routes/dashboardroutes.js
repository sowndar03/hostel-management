const express = require('express');
const router = express.Router();
const dashboardController = require('../Controller/Dashboardcontroller');

router.get('/ticketOpenClose', dashboardController.ticketOpenClose);
router.get('/tickeStatusWise', dashboardController.tickeStatusWise);

module.exports = router;
