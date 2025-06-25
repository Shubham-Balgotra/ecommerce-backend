const orderService = require("../services/order.service.js");

const createOrder = async (req, res) => {
  const user = await req.user;
  try {
    let createdOrder = await orderService.createOrder(user,req.body.shippingAddress,  req.body);
    return res.status(200).send(createdOrder);
  } catch (error) {
    
    console.error("Order creation error:", error);
    return res.status(500).send({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  const user = await req.user;
  try {
    let createdOrder = await orderService.findOrderById(req.params.id);
    return res.status(200).send(createdOrder);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const OrderHistory = async (req, res) => {
  const user = await req.user;
  try {
    let createdOrder = await orderService.userOrderHistory(user._id);
    return res.status(200).send(createdOrder);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {createOrder, findOrderById,OrderHistory}
