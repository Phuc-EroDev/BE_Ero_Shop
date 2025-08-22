const OrderModel = require('../models/OrderProduct');
const ProductModel = require('../models/ProductModel');
const EmailService = require('./EmailService');

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      fullName,
      address,
      city,
      phone,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid,
      paidAt,
      user,
      email,
    } = newOrder;
    try {
      const promises = orderItems.map(async (order) => {
        const productData = await ProductModel.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          { new: true },
        );

        if (productData) {
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
            isPaid,
            paidAt,
            user,
          });
          if (createdOrder) {
            return {
              status: 'OK',
              message: 'Order created successfully',
            };
          }
        } else {
          return {
            status: 'ERR',
            message: 'Not enough product quality',
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id);
      if (newData.length) {
        resolve({
          status: 'ERR',
          message: `San pham voi id ${newData.join(', ')} khong du hang`,
        });
      }
      await EmailService.sendEmailCreateOrder(email, orderItems);
      resolve({
        status: 'OK',
        message: 'Order created successfully',
      });
    } catch (err) {
      console.log('Error creating order:', err);
      reject(err);
    }
  });
};

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await OrderModel.find({
        user: id,
      });
      if (order === null) {
        resolve({
          status: 'OK',
          message: 'The Order is not found',
        });
      }

      resolve({
        status: 'OK',
        message: 'Success',
        data: order,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const cancelOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const promises = data.map(async (order) => {
        const productData = await ProductModel.findOneAndUpdate(
          {
            _id: order.product,
            selled: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: +order.amount,
              selled: -order.amount,
            },
          },
          { new: true },
        );

        if (productData) {
          order = await OrderModel.findByIdAndDelete(id);
          if (order === null) {
            resolve({
              status: 'OK',
              message: 'The Order is not defined',
            });
          }
        } else {
          return {
            status: 'ERR',
            message: 'Not enough product quality',
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id);
      if (newData.length) {
        resolve({
          status: 'ERR',
          message: `San pham voi id ${newData.join(', ')} khong ton tai`,
        });
      }
      resolve({
        status: 'OK',
        message: 'Order canceled successfully',
        data: order,
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  createOrder,
  getOrderDetails,
  cancelOrder,
};
