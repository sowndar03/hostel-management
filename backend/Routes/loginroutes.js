const express = require('express');
const router = express.Router();
const loginController = require('../Controller/logincontroller');

router.post('/', loginController.store);

module.exports = router;