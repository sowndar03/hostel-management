const express = require('express');
const router = express.Router();
const uploadController = require('../Controller/Admin/Uploadcontroller');

router.get('/upload/list', uploadController.list);
router.get('/upload/view/:id', uploadController.view);

module.exports = router;
