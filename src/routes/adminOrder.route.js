const express = require('express');
const router = express.Router();

const orderController = require('../controller/adminOrder.controller.js');
const { authenticate } = require('../middleware/authenticate.js');
const restrictToAdmin = require('../middleware/restrictToAdmin.js');

// Protect all routes with both middlewares
router.use(authenticate, restrictToAdmin);

router.get("/", orderController.getAllOrders);
router.put("/:orderId/confirmed", orderController.confirmOrders);
router.put("/:orderId/ship", orderController.shipOrders);
router.put("/:orderId/deliver", orderController.deliverOrders);
router.put("/:orderId/cancel", orderController.cancelOrders);
router.put("/:orderId/delete", orderController.deleteOrders);

module.exports = router;
