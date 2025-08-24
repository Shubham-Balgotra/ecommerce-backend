const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const orderService = require("../services/order.service.js");
const logger = require("../utils/logger.js");

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      logger.error(` Webhook verification failed: ${err.message}`, { error: err });
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    //  Payment succeeded
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      try {
        await orderService.placeOrder(orderId);
        logger.info(` Order ${orderId} updated to ORDER PLACED`);
      } catch (error) {
        logger.error(` Failed to update order ${orderId}`, { error });
      }
    }

    //  Payment failed
    if (event.type === "payment_intent.failed") {
      const orderId = event.data.object.metadata?.orderId;

      if (orderId) {
        try {
          const order = await orderService.findOrderById(orderId);

          if (order && order.paymentDetails) {
            order.paymentDetails.paymentStatus = "FAILED";
            await order.save();
            logger.info(`❌ Order ${orderId} payment failed`);
          } else {
            logger.warn(`⚠️ Order ${orderId} has no paymentDetails`);
          }
        } catch (error) {
          logger.error(`⚠️ Failed to update order ${orderId}`, { error });
        }
      } else {
        logger.warn("⚠️ Order ID missing in metadata for payment_intent.failed");
      }
    }

    res.status(200).send();
  }
);

module.exports = router;
