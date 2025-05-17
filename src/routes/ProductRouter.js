const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create', ProductController.createProduct);
router.post('/update/:id', authMiddleware, ProductController.updateProduct);

module.exports = router;
