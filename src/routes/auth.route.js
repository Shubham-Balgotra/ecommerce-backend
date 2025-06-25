const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');


router.post('/signup', authController.register);
router.post('/signin', authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/update-password', authController.updatePassword);

module.exports = router;