const Rating = require('../models/rating.model.js');
const productService = require('../services/product.service.js');
const logger = require('../utils/logger.js');

async function createRating(req, user) {
  logger.info(`Creating rating for product: ${req.productId}`);
  
  const product = await productService.findProductById(req.productId);
  logger.info(`Product fetched: ${product._id}`);

  const rating = new Rating({
    user: user._id,
    product: product._id,
    rating: req.rating,
    createdAt: new Date()
  });
  
  const savedRating = await rating.save();
  logger.info(`Rating created successfully: ${savedRating._id}`);
  return savedRating;
}

async function getProductRating(productId) {
  logger.info(`Fetching ratings for product: ${productId}`);
  
  const ratings = await Rating.find({ product: productId }).populate('user', 'firstName lastName');
  logger.info(`Ratings fetched: ${ratings.length} ratings`);
  return ratings;
}

module.exports = { createRating, getProductRating };