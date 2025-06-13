const OrderService = require('../services/OrderService');

const createOrder = async (req, res) => {
  try {
    const { fullName, address, city, phone, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;
    if (!fullName || !address || !city || !phone || !paymentMethod || !itemsPrice || !shippingPrice || !totalPrice) {
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

module.exports = {
  createOrder,
};
