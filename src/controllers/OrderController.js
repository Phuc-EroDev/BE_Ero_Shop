const OrderService = require('../services/OrderService');

const createOrder = async (req, res) => {
  try {
    const { fullName, address, city, phone, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;
    if (
      !fullName ||
      !address ||
      !city ||
      !phone ||
      !paymentMethod ||
      typeof itemsPrice !== 'number' ||
      itemsPrice < 0 ||
      typeof shippingPrice !== 'number' ||
      shippingPrice < 0 ||
      typeof totalPrice !== 'number' ||
      totalPrice < 0
    ) {
      return res.status(400).json({
        status: 'Error',
        message: 'Please fill all the fields',
      });
    }
    const response = await OrderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: 'Error',
        message: 'The userId is required',
      });
    }
    const response = await OrderService.getOrderDetails(userId);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;
    if (!orderId) {
      return res.status(400).json({
        status: 'Error',
        message: 'The orderId is required',
      });
    }
    const response = await OrderService.cancelOrder(orderId, data);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports = {
  createOrder,
  getOrderDetails,
  cancelOrder,
};
