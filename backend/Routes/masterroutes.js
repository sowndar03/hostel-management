const express = require('express');
const router = express.Router();
const locationController = require('../Controller/Master/locationcontroller');

router.post('/location/add', locationController.store);
router.post('/location/uniqueCheck', locationController.uniqueCheck);

module.exports = router;