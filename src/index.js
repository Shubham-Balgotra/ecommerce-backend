const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger.js');

const app = express();

// ✅ Setup CORS options
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://shubhamify.vercel.app', // fallback for dev
  credentials: true,
};

// ✅ Apply CORS middleware
app.use(cors(corsOptions));

// ✅ Handle preflight (OPTIONS) requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set COOP and COEP headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  return res.status(200).send({ message: 'Welcome to ecommerce api', status: true });
});

// ✅ All your routes
const authRouters = require('./routes/auth.route.js');
app.use('/auth', authRouters);

const userRouters = require('./routes/user.route.js');
app.use('/api/users', userRouters);

const productRouter = require('./routes/product.route.js');
app.use('/api/products', productRouter);

const adminProductRouter = require('./routes/adminProduct.route.js');
app.use('/api/admin/product', adminProductRouter);

const cartRouter = require('./routes/cart.routes.js');
app.use('/api/cart', cartRouter);

const cartItemRouter = require('./routes/cartItems.route.js');
app.use('/api/cart_items', cartItemRouter);

const orderRouter = require('./routes/order.route.js');
app.use('/api/orders', orderRouter);

const adminOrderRouter = require('./routes/adminOrder.route.js');
app.use('/api/admin/orders', adminOrderRouter);

const reviewRouter = require('./routes/review.route.js');
app.use('/api/reviews', reviewRouter);

const ratingRouter = require('./routes/rating.route.js');
app.use('/api/ratings', ratingRouter);

const supportRoutes = require('./routes/support.route.js');
app.use('/api/support', supportRoutes);

const stripeRoutes = require('./routes/stripe.route.js');
app.use('/api/stripe', stripeRoutes);

const addressRoutes = require('./routes/address.route.js');
app.use('/api/addresses', addressRoutes);

const stripeWebhookRoutes = require('./routes/stripe.webhook.route.js');
app.use('/api/stripe/webhook', stripeWebhookRoutes);

// ✅ Error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).send({ error: 'Something went wrong' });
});

module.exports = app;
