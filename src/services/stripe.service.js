require("dotenv").config(); 
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async ({ orderId, amount, email }) => {
  if (!orderId || !amount || !email) {
    throw new Error("Missing required parameters");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Order #${orderId}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${process.env.FRONTEND_URL}/checkout/success/${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout?step=3`,
      metadata: { orderId },
    });

    return session.id;
  } catch (error) {
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
};