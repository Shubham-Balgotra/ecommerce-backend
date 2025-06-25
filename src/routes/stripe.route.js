const express = require('express');
const router = express.Router();
const stripeController = require('../controller/stripe.controller.js');
const { authenticate } = require('../middleware/authenticate.js');
const logger = require('../utils/logger.js');

router.post('/create-checkout-session', authenticate, (req, res, next) => {
  logger.info(`Received request to create Stripe checkout session for user: ${req.user._id}`);
  stripeController.createSession(req, res, next);
});

module.exports = router;