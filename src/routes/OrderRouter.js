const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/create/:id', authUserMiddleware, OrderController.createOrder);
router.get('/get-order-details/:id', authUserMiddleware, OrderController.getOrderDetails);
router.get('/cancel-order/:id', authUserMiddleware, OrderController.cancelOrder);

module.exports = router;
