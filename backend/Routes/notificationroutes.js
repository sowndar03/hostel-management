const express = require('express');
const router = express.Router();
const loginController = require('../Controller/logincontroller');

router.post('/getAll', loginController.notification);
router.post('/markasread', loginController.markasread);

module.exports = router;
