const express = require('express');
const router = express.Router();
const loginController = require('../Controller/logincontroller');
const middleware = require('../Middleware/Middleware');

const middlewares = [middleware.AuthMiddleware];

router.post('/', loginController.store);
router.post('/password/check', middlewares, loginController.passWordCheck);
router.post('/password/change', middlewares, loginController.passwordChange);
router.post('/coverImageUplaod', middlewares, middleware.createImageHandler("Coverimage", false), loginController.coverImageUpload);
router.post('/profileImageUpload', middlewares, middleware.createImageHandler("profileImage", false), loginController.profileImageUpload);

module.exports = router;