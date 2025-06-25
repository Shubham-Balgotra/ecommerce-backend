const Category = require('../models/category.model.js');
const Product = require('../models/product.model.js');
const logger = require('../utils/logger.js');

async function createProduct(reqData) {
  try {
    let topLevel = await Category.findOne({ name: reqData.topLevelCategory });
    if (!topLevel) {
      topLevel = new Category({
        name: reqData.topLevelCategory,
        level: 1
      });
      await topLevel.save();
      logger.info(`Created top-level category: ${topLevel._id}`);
    }
    let secondLevel = await Category.findOne({
      name: reqData.secondLevelCategory,
      parentCategory: topLevel._id
    });
    if (!secondLevel) {
      secondLevel = new Category({
        name: reqData.secondLevelCategory,
        parentCategory: topLevel._id,
        level: 2
      });
      await secondLevel.save();
      logger.info(`Created second-level category: ${secondLevel._id}`);
    }
    let thirdLevel = await Category.findOne({
      name: reqData.thirdLevelCategory,
      parentCategory: secondLevel._id
    });
    if (!thirdLevel) {
      thirdLevel = new Category({
        name: reqData.thirdLevelCategory,
        parentCategory: secondLevel._id,
        level: 3
      });
      await thirdLevel.save();
      logger.info(`Created third-level category: ${thirdLevel._id}`);
    }
    const product = new Product({
      title: reqData.title,
      color: reqData.color,
      description: reqData.description,
      discountedPrice: reqData.discountedPrice,
      discountPercent: reqData.discountPercent,
      imageUrl: reqData.imageUrl,
      brand: reqData.brand,
      price: reqData.price,
      sizes: reqData.sizes,
      quantity: reqData.quantity,
      category: thirdLevel._id
    });
    const savedProduct = await product.save();
    logger.info(`Product saved: ${savedProduct._id}`);
    return savedProduct;
  } catch (error) {
    logger.error(`Error creating product: ${error.message}`);
    throw error;
  }
}

async function deleteProduct(productId) {
  try {
    const product = await findProductById(productId);
    await Product.findByIdAndDelete(productId);
    logger.info(`Product deleted: ${productId}`);
    return "Product deleted successfully";
  } catch (error) {
    logger.error(`Error deleting product ${productId}: ${error.message}`);
    throw error;
  }
}

async function updateProduct(productId, reqData) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, reqData, { new: true });
    logger.info(`Product updated: ${productId}`);
    return updatedProduct;
  } catch (error) {
    logger.error(`Error updating product ${productId}: ${error.message}`);
    throw error;
  }
}

const mongoose = require('mongoose');

async function findProductById(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn(`Invalid product ID: ${id}`);
      throw new Error(`Invalid product ID: ${id}`);
    }
    const product = await Product.findById(id)
      .populate('category')
      .populate('review')
      .populate('ratings')
      .exec();
    if (!product) {
      logger.warn(`Product not found: ${id}`);
      throw new Error(`Product not found with id: ${id}`);
    }
    logger.info(`Product found: ${id}`);
    return product;
  } catch (error) {
    logger.error(`Error finding product ${id}: ${error.stack}`);
    throw error;
  }
}
async function getAllProduct(reqQuery) {
  try {
    let { category, color, sizes, minPrice, maxPrice, minDiscount, sort, stock, pageNumber, pageSize } = reqQuery;
    pageSize = parseInt(pageSize) || 10;
    pageNumber = parseInt(pageNumber) || 1;
    let filter = {};
    if (category) {
      const existCategory = await Category.findOne({ name: category });
      if (existCategory) {
        filter.category = existCategory._id;
      } else {
        logger.warn(`Category not found: ${category}`);
        return { content: [], currentPage: 1, pageSize: 0, totalPage: 0 };
      }
    }
    if (color) {
      const colorSet = new Set(color.split(",").map(color => color.trim().toLowerCase()));
      const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
      if (colorRegex) filter.color = colorRegex;
    }
    if (sizes) {
      const setSize = new Set(sizes);
      filter["sizes.name"] = { $in: [...setSize] };
    }
    if (minPrice && maxPrice) {
      filter.discountedPrice = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    }
    if (minDiscount) {
      filter.discountPercent = { $gt: parseFloat(minDiscount) };
    }
    if (stock === "in_stock") {
      filter.quantity = { $gte: 1 };
    } else if (stock === "out_of_stock") {
      filter.quantity = { $lt: 1 };
    }
    let sortOptions = {};
    const sortMapping = {
      "most-popular": { quantitySold: -1 },
      "best-rating": { rating: -1 },
      "newest": { createdAt: -1 },
      "price-high": { discountedPrice: -1 },
      "price-low": { discountedPrice: 1 }
    };
    if (sort && sortMapping[sort]) {
      sortOptions = sortMapping[sort];
    }
    const totalProducts = await Product.countDocuments(filter);
    const skip = (pageNumber - 1) * pageSize;
    const products = await Product.find(filter)
      .populate("category")
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
    logger.info(`Fetched ${products.length} products with filters: ${JSON.stringify(filter)}`);
    return {
      content: products,
      currentPage: pageNumber,
      totalPage: Math.ceil(totalProducts / pageSize)
    };
  } catch (error) {
    logger.error(`Error fetching products: ${error.message}`);
    throw error;
  }
}

async function createMultipleProduct(products) {
  try {
    const createdProducts = [];
    for (let product of products) {
      const savedProduct = await createProduct(product);
      createdProducts.push(savedProduct);
      logger.info(`Created product in batch: ${savedProduct._id}`);
    }
    return createdProducts;
  } catch (error) {
    logger.error(`Error creating multiple products: ${error.message}`);
    throw error;
  }
}

module.exports = {
  createProduct,
  createMultipleProduct,
  deleteProduct,
  updateProduct,
  findProductById,
  getAllProduct
};