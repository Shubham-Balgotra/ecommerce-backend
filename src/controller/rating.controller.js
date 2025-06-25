const ratingService = require("../services/rating.service.js");
const logger = require("../utils/logger.js");

const createRating = async (req, res) => {
  try {
    const rating = await ratingService.createRating(req.body, req.user);
    logger.info(`Rating created: ${rating._id}`);
    return res.status(201).send(rating);
  } catch (error) {
    logger.error(`Error creating rating: ${error.message}`);
    return res.status(500).send({ error: error.message });
  }
};

const getAllRating = async (req, res) => {
  try {
    const productId = req.params.productId;
    const ratings = await ratingService.getProductRating(productId);
    logger.info(`Fetched ratings for product: ${productId}, ${ratings.length} ratings`);
    return res.status(200).send(ratings); // Fixed status code
  } catch (error) {
    logger.error(`Error fetching ratings for product ${productId}: ${error.message}`);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { createRating, getAllRating };