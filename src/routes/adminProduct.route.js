const express = require('express');
const router = express.Router();

const productController = require('../controller/product.controller.js');
const { authenticate } = require('../middleware/authenticate.js');
const restrictToAdmin = require('../middleware/restrictToAdmin.js');

// Protect all routes with both middlewares
router.use(authenticate, restrictToAdmin);

router.post("/", productController.createProduct);
router.post("/creates", productController.createMultipleProduct);
router.delete("/:id", productController.deleteProduct);
router.put("/:id", productController.updateProduct);

module.exports = router;
