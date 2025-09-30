const express = require('express');
const router = express.Router();
const ticketingcontroller = require('../Controller/Ticketing/ticketingcontroller');
const { createImageHandler } = require('../Middleware/Middleware');

router.get('/list', ticketingcontroller.list);
router.post('/add',createImageHandler("issue", false), ticketingcontroller.store);
router.get('/view/:id', ticketingcontroller.selectOne);
router.get('/issueFiles/:id', ticketingcontroller.selectIssuesFiles);

module.exports = router;