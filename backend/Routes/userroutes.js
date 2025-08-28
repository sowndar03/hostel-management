const express = require('express');
const router = express.Router();
const loginController = require('../Controller/logincontroller');

router.post('/setTheme', loginController.setTheme);
router.post('/getTheme', loginController.getTheme);
router.post('/loggedUser', loginController.loggedUser);

module.exports = router;
