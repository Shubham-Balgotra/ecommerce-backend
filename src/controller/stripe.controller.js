

const stripeService = require('../services/stripe.service.js');
const logger = require('../utils/logger.js');

const createSession = async (req, res) => {
  try {
    const { orderId, amount, email } = req.body;
    logger.info("Creating Stripe session with:", { orderId, amount, email });

    const sessionId = await stripeService.createCheckoutSession({ orderId, amount, email });

    logger.info(`Stripe session created: ${sessionId}`);
    return res.status(200).json({ id: sessionId }); // ✅ FIXED HERE
  } catch (error) {
    logger.error(`Error creating Stripe session for order ${req.body.orderId}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};



module.exports = { createSession };