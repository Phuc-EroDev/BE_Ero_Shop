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
      shippingMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      isPaid,
      paidAt,
      user,
      email,
    } = newOrder;

    try {
      const stockCheckPromises = orderItems.map(async (order) => {
        const productData = await ProductModel.findOne({
          _id: order.product,
          countInStock: { $gte: order.amount },
        });

        if (!productData) {
          return {
            status: 'ERR',
            message: 'Not enough product quantity',
            id: order.product,
          };
        }

        return {
          status: 'OK',
          product: order.product,
          amount: order.amount,
        };
      });

      const stockResults = await Promise.all(stockCheckPromises);
      const stockErrors = stockResults.filter((item) => item.status === 'ERR');

      if (stockErrors.length) {
        return resolve({
          status: 'ERR',
          message: `San pham voi id ${stockErrors.map((item) => item.id).join(', ')} khong du hang`,
        });
      }

      // Transform orderItems để image thành string (lấy ảnh đầu tiên)
      const transformedOrderItems = orderItems.map((item) => ({
        ...item,
        image: Array.isArray(item.image) ? item.image[0].url : item.image,
      }));

      const createdOrder = await OrderModel.create({
        orderItems: transformedOrderItems,
        shippingAddress: {
          fullName,
          address,
          city,
          phone,
        },
        paymentMethod,
        shippingMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        isPaid,
        paidAt,
        user,
      });

      if (!createdOrder) {
        return resolve({
          status: 'ERR',
          message: 'Failed to create order',
        });
      }

      const updatePromises = orderItems.map(async (order) => {
        const productData = await ProductModel.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount }, // Double check
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          { new: true },
        );

        if (!productData) {
          return {
            status: 'ERR',
            message: 'Failed to update stock',
            id: order.product,
          };
        }

        return {
          status: 'OK',
          product: order.product,
        };
      });

      const updateResults = await Promise.all(updatePromises);
      const updateErrors = updateResults.filter((item) => item.status === 'ERR');

      if (updateErrors.length) {
        await OrderModel.findByIdAndDelete(createdOrder._id);
        return resolve({
          status: 'ERR',
          message: `Failed to update stock for products: ${updateErrors.map((item) => item.id).join(', ')}`,
        });
      }

      try {
        await EmailService.sendEmailCreateOrder(email, orderItems);
      } catch (emailError) {
        // console.log('Email sending failed, but order created successfully:', emailError);
      }

      resolve({
        status: 'OK',
        message: 'Order created successfully',
        data: createdOrder,
      });
    } catch (err) {
      // console.log('Error creating order:', err);
      reject(err);
    }
  });
};

const getAllOrdersByUser = (id) => {
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

const getOrderDetail = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await OrderModel.findById(id);
      if (!order) {
        resolve({
          status: 'ERR',
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

const cancelOrder = (id, orderItems) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatePromises = orderItems.map(async (item) => {
        const productData = await ProductModel.findOneAndUpdate(
          {
            _id: item.product,
            selled: { $gte: item.amount },
          },
          {
            $inc: {
              countInStock: +item.amount,
              selled: -item.amount,
            },
          },
          { new: true },
        );

        if (!productData) {
          return {
            status: 'ERR',
            message: 'Not enough sold quantity to cancel',
            productId: item.product,
          };
        }

        return {
          status: 'OK',
          productId: item.product,
        };
      });

      const updateResults = await Promise.all(updatePromises);
      const updateErrors = updateResults.filter((item) => item.status === 'ERR');

      if (updateErrors.length) {
        return resolve({
          status: 'ERR',
          message: `Không thể hủy order. Sản phẩm với id ${updateErrors
            .map((item) => item.productId)
            .join(', ')} không đủ số lượng đã bán để hoàn lại`,
        });
      }

      const deletedOrder = await OrderModel.findByIdAndDelete(id);

      if (!deletedOrder) {
        const rollbackPromises = orderItems.map(async (item) => {
          await ProductModel.findOneAndUpdate(
            { _id: item.product },
            {
              $inc: {
                countInStock: -item.amount,
                selled: +item.amount,
              },
            },
          );
        });
        await Promise.all(rollbackPromises);

        return resolve({
          status: 'ERR',
          message: 'Order không tồn tại',
        });
      }

      resolve({
        status: 'OK',
        message: 'Hủy order thành công',
        data: deletedOrder,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const deleteManyOrder = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await OrderModel.deleteMany({ _id: { $in: ids } });
      resolve({
        status: 'OK',
        message: 'Delete many order Success',
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await OrderModel.find();
      resolve({
        status: 'OK',
        message: 'Success',
        data: allOrder,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const updateDeliveryStatus = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        orderId,
        {
          isDelivered: true,
          deliveredAt: new Date(),
        },
        { new: true },
      );

      if (!updatedOrder) {
        return resolve({
          status: 'ERR',
          message: 'Order không tồn tại',
        });
      }

      resolve({
        status: 'OK',
        message: 'Cập nhật trạng thái giao hàng thành công',
        data: updatedOrder,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const updatePaymentStatus = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        orderId,
        {
          isPaid: true,
          paidAt: new Date(),
        },
        { new: true },
      );

      if (!updatedOrder) {
        return resolve({
          status: 'ERR',
          message: 'Order không tồn tại',
        });
      }

      resolve({
        status: 'OK',
        message: 'Cập nhật trạng thái thanh toán thành công',
        data: updatedOrder,
      });
    } catch (err) {
      reject(err);
    }
  });
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
