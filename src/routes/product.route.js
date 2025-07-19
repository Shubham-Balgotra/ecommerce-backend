const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller.js')


router.get('/', productController.getAllProduct);
router.get('/:id', productController.findProductById);


module.exports = router;
