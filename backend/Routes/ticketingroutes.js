const express = require('express');
const router = express.Router();
const ticketingcontroller = require('../Controller/Ticketing/ticketingcontroller');
const { createImageHandler } = require('../Middleware/Middleware');

router.get('/list', ticketingcontroller.list);
router.post('/add',createImageHandler("issue", false), ticketingcontroller.store);
router.get('/view/:id', ticketingcontroller.selectOne);
router.get('/issueFiles/:id', ticketingcontroller.selectIssuesFiles);
router.post('/first_approval', ticketingcontroller.first_approvals);
router.post('/close_approval', ticketingcontroller.close_approval);
router.post('/final_approval', ticketingcontroller.final_approval);
router.post('/searchValues', ticketingcontroller.searchValues);

module.exports = router;