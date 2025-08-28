const express = require('express');
const router = express.Router();
const loginController = require('../Controller/logincontroller');

router.post('/', loginController.setTheme);

module.exports = router;