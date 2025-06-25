const orderService = require('../services/order.service.js')

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrder();
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const confirmOrders = async (req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.confirmOrder(orderId);
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const shipOrders = async (req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.shipOrder(orderId);
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const deliverOrders = async (req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.deliverOrder(orderId);
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const cancelOrders = async (req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.cancelOrder(orderId);
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

const deleteOrders = async (req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.deleteOrder(orderId);
        return res.status(200).send(orders)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports = { getAllOrders,
    confirmOrders,
    shipOrders,
    deliverOrders,
    cancelOrders,
    deleteOrders

}