const Review = require('../models/reviews.model.js');
const productService = require('../services/product.service.js');
const logger = require('../utils/logger.js');

async function createReview(reqData, user) {
  logger.info(`Creating review for product: ${reqData.productId}`);
  
  const product = await productService.findProductById(reqData.productId);
  logger.info(`Product fetched: ${product._id}`);

  const review = new Review({
    user: user._id,
    product: product._id,
    review: reqData.review,
    createdAt: new Date()
  });
  
  const savedReview = await review.save();
  logger.info(`Review created successfully: ${savedReview._id}`);
  
  return savedReview;
}

async function getAllReview(productId) {
  logger.info(`Fetching reviews for product: ${productId}`);
  
  const product = await productService.findProductById(productId);
  logger.info(`Product fetched: ${product._id}`);

  const reviews = await Review.find({ product: productId })
    .populate('user', '-password -address -paymentInformation -__v');
  
  logger.info(`Reviews fetched: ${reviews.length} reviews`);
  return reviews;
}

module.exports = { createReview, getAllReview };