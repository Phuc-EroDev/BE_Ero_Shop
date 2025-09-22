const OrderService = require('../services/OrderService');

const createOrder = async (req, res) => {
  try {
    const { fullName, address, city, phone, paymentMethod, shippingMethod, itemsPrice, shippingPrice, totalPrice } =
      req.body;
    if (
      !fullName ||
      !address ||
      !city ||
      !phone ||
      !paymentMethod ||
      !shippingMethod ||
      typeof itemsPrice !== 'number' ||
      itemsPrice < 0 ||
      typeof shippingPrice !== 'number' ||
      shippingPrice < 0 ||
      typeof totalPrice !== 'number' ||
      totalPrice < 0
    ) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Please fill all the fields',
      });
    }
    const response = await OrderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ message: err });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'The userId is required',
      });
    }
    const response = await OrderService.getAllOrdersByUser(userId);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'The orderId is required',
      });
    }
    const response = await OrderService.getOrderDetail(orderId);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body.orderItems;
    if (!orderId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'The orderId is required',
      });
    }
    const response = await OrderService.cancelOrder(orderId, data);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const deleteManyOrder = async (req, res) => {
  try {
    const data = req.body;
    if (!data?.ids) {
      return res.status(400).json({
        status: 'ERR',
        message: 'The ids is required',
      });
    }
    const response = await OrderService.deleteManyOrder(data?.ids);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const response = await OrderService.getAllOrder();
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'The orderId is required',
      });
    }
    const response = await OrderService.updateDeliveryStatus(orderId);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'The orderId is required',
      });
    }
    const response = await OrderService.updatePaymentStatus(orderId);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderDetail,
  cancelOrder,
  deleteManyOrder,
  getAllOrder,
  updateDeliveryStatus,
  updatePaymentStatus,
};
