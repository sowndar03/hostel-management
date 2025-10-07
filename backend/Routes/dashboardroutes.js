const express = require('express');
const router = express.Router();
const dashboardController = require('../Controller/Dashboardcontroller');

router.get('/ticketOpenClose', dashboardController.ticketOpenClose);
router.get('/tickeStatusWise', dashboardController.tickeStatusWise);
router.get('/hostelWiseStudent', dashboardController.hostelWiseStudent);
router.get('/monthWiseHostellerCount', dashboardController.monthWiseHostellerCount);
router.get('/advanceAmount', dashboardController.advanceAmount);
router.get('/currentMonthRentStatus', dashboardController.currentMonthRentStatus);

module.exports = router;
