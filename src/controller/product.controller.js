const productService = require('../services/product.service.js');
const logger = require('../utils/logger.js');

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    logger.info(`Product created: ${product._id}`);
    return res.status(201).send({
      success: true,
      data: product,
      message: 'Product created successfully.'
    });
  } catch (error) {
    logger.error(`Error creating product: ${error.message}`);
    return res.status(500).send({
      success: false,
      error: error.message
    });
  }
};

const createMultipleProduct = async (req, res) => {
  try {
    const products = await productService.createMultipleProduct(req.body);
    logger.info(`Created ${products.length} products`);
    return res.status(201).send({
      success: true,
      data: products,
      message: 'Products created successfully.'
    });
  } catch (error) {
    logger.error(`Error creating multiple products: ${error.message}`);
    return res.status(500).send({
      success: false,
      error: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const deleted = await productService.deleteProduct(productId);
    logger.info(`Product deleted: ${productId}`);
    return res.status(200).send({
      success: true,
      data: deleted,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    logger.error(`Error deleting product ${productId}: ${error.message}`);
    return res.status(500).send({
      success: false,
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const updated = await productService.updateProduct(productId, req.body);
    logger.info(`Product updated: ${productId}`);
    return res.status(200).send({
      success: true,
      data: updated,
      message: 'Product updated successfully.'
    });
  } catch (error) {
    logger.error(`Error updating product ${productId}: ${error.message}`);
    return res.status(500).send({
      success: false,
      error: error.message
    });
  }
};

const mongoose = require('mongoose');

const findProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      logger.warn(`Invalid product ID: ${productId}`);
      return res.status(400).send({
        success: false,
        message: 'Invalid product ID.'
      });
    }
    const product = await productService.findProductById(productId);
    if (!product) {
      logger.warn(`Product not found: ${productId}`);
      return res.status(404).send({
        success: false,
        message: 'Product not found.'
      });
    }
    logger.info(`Product fetched: ${productId}`);
    return res.status(200).send({
      success: true,
      data: product,
      message: 'Product fetched successfully.'
    });
  } catch (error) {
    logger.error(`Error fetching product ${productId}: ${error.stack}`);
    return res.status(500).send({
      success: false,
      error: error.message
    });
  }
};
const getAllProduct = async (req, res) => {
  try {
    const products = await productService.getAllProduct(req.query);
    logger.info(`Fetched ${products.content.length} products`);
    return res.status(200).send({
      success: true,
      data: products,
      message: 'Products fetched successfully.'
    });
  } catch (error) {
    logger.error(`Error fetching products: ${error.message}`);
    return res.status(500).send({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  createMultipleProduct,
  deleteProduct,
  updateProduct,
  findProductById,
  getAllProduct
};
