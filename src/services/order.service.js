const Address = require("../models/address.model.js");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItems.model.js");
const cartService = require("../services/cart.service.js");
const logger = require("../utils/logger.js");

async function createOrder(user, shippingAddress) {
  let address;
  if (shippingAddress._id) {
    let existAddress = await Address.findById(shippingAddress._id);
    address = existAddress;
  } else {
    address = new Address(shippingAddress);
    address.user = user._id;
    await address.save();
    user.address.push(address);
    await user.save();
  }
  const cart = await cartService.findUserCart(user._id);
  const orderItems = [];
  for (const item of cart.cartItems) {
    const orderItem = new OrderItem({
      price: item.price,
      product: item.product,
      quantity: item.quantity,
      size: item.size,
      userId: item.userId,
      discountedPrice: item.discountedPrice,
    });
    const createdOrderItem = await orderItem.save();
    orderItems.push(createdOrderItem);
  }
  logger.info(`OrderItems created: ${orderItems.map(i => i._id).join(', ')}`);

  const createdOrder = new Order({
    user: user._id,
    orderItems,
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalPrice - cart.discount,
    discount: cart.discount,
    totalItems: cart.totalItem,
    shippingAddress: address,
  });
  const savedOrder = await createdOrder.save();
  logger.info(`Order saved: ${savedOrder._id}`);
  return savedOrder;
}

async function placeOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "ORDER PLACED";
  order.paymentDetails.paymentStatus = "COMPLETED";
  logger.info(`Order placed: ${orderId}`);
  return await order.save();
}

async function confirmOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "ORDER CONFIRMED";
  logger.info(`Order confirmed: ${orderId}`);
  return await order.save();
}

async function shipOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "SHIPPED";
  logger.info(`Order shipped: ${orderId}`);
  return await order.save();
}

async function deliverOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "DELIVERED";
  logger.info(`Order delivered: ${orderId}`);
  return await order.save();
}

async function cancelOrder(orderId) {
  const order = await findOrderById(orderId);
  order.orderStatus = "CANCELED";
  logger.info(`Order canceled: ${orderId}`);
  return await order.save();
}

async function findOrderById(orderId) {
  const order = await Order.findById(orderId)
    .populate("user")
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("shippingAddress");
  if (!order) {
    logger.error(`Order not found: ${orderId}`);
  }
  return order;
}

async function userOrderHistory(userId) {
  try {
    const orders = await Order.find({ user: userId })
      .populate({ path: "orderItems", populate: { path: "product" } })
      .lean();
    logger.info(`Fetched order history for user: ${userId}, ${orders.length} orders`);
    return orders;
  } catch (error) {
    logger.error(`Error fetching order history for user ${userId}: ${error.message}`);
    throw new Error(error.message);
  }
}

async function getAllOrder() {
  const orders = await Order.find()
    .populate({ path: "orderItems", populate: { path: "product" } })
    .lean();
  logger.info(`Fetched all orders: ${orders.length} orders`);
  return orders;
}

async function deleteOrder(orderId) {
  const order = await findOrderById(orderId);
  await Order.findByIdAndDelete(order._id);
  logger.info(`Order deleted: ${orderId}`);
}

module.exports = {
  createOrder,
  placeOrder,
  confirmOrder,
  shipOrder,
  deliverOrder,
  cancelOrder,
  findOrderById,
  userOrderHistory,
  getAllOrder,
  deleteOrder,
};