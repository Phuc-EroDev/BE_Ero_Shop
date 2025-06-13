const OrderModel = require('../models/OrderProduct');

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const { orderItems, fullName, address, city, phone, paymentMethod, itemsPrice, shippingPrice, totalPrice, user } =
      newOrder;
    try {
      const createdOrder = await OrderModel.create({
        orderItems,
        shippingAddress: {
          fullName,
          address,
          city,
          phone,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user,
      });
      if (createdOrder) {
        resolve({
          status: 'OK',
          message: 'Order created successfully',
          data: createdOrder,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  createOrder,
};
