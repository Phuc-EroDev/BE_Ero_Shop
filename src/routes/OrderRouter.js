const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authUserMiddleware, authMiddleware } = require('../middleware/authMiddleware');

router.post('/create/:id', authUserMiddleware, OrderController.createOrder);
router.get('/get-order-details/:id', authUserMiddleware, OrderController.getOrderDetails);
router.delete('/cancel-order/:id', authUserMiddleware, OrderController.cancelOrder);
router.get('/getAll', authMiddleware, OrderController.getAllOrder);

module.exports = router;
