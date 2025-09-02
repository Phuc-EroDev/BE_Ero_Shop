const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authUserMiddleware, authMiddleware, authUserOrderMiddleware } = require('../middleware/authMiddleware');

router.post('/create', OrderController.createOrder);
router.get('/get-all-by-user/:id', authUserMiddleware, OrderController.getAllOrdersByUser);
router.post('/detail/:id', authUserOrderMiddleware, OrderController.getOrderDetail);
router.get('/getAll', authMiddleware, OrderController.getAllOrder);
router.put('/delivery/:id', authMiddleware, OrderController.updateDeliveryStatus);
router.put('/payment/:id', authUserOrderMiddleware, OrderController.updatePaymentStatus);
router.delete('/cancel/:id', authUserOrderMiddleware, OrderController.cancelOrder);
router.delete('/delete-many', authMiddleware, OrderController.deleteManyOrder);

module.exports = router;
