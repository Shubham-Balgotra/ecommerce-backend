const reviewService = require("../services/review.service.js");
const logger = require("../utils/logger.js");

const createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.body, req.user);
    logger.info(`Review created: ${review._id}`);
    return res.status(201).send(review);
  } catch (error) {
    logger.error(`Error creating review: ${error.message}`);
    return res.status(500).send({ error: error.message });
  }
};

const getAllReview = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await reviewService.getAllReview(productId);
    logger.info(`Fetched reviews for product: ${productId}, ${reviews.length} reviews`);
    return res.status(200).send(reviews); // Fixed status code
  } catch (error) {
    logger.error(`Error fetching reviews for product ${productId}: ${error.message}`);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { createReview, getAllReview };