const ProductService = require('../services/ProductService');

const createProduct = async (req, res) => {
  try {
    const { name, image, type, price, countInStock, rating, discount, description } = req.body;
    if (!name || !image || !type || !price || !countInStock || !rating || !discount) {
      return res.status(400).json({
        status: 'Error',
        message: 'Please fill all the fields',
      });
    }
    const response = await ProductService.createProduct(req.body);
    return res.status(200).json(response);
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ message: err });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    if (!productId) {
      return res.status(400).json({
        status: 'Error',
        message: 'The productId is required',
      });
    }
    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: 'Error',
        message: 'The productId is required',
      });
    }
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const getAllTypeProduct = async (req, res) => {
  try {
    const response = await ProductService.getAllTypeProduct();
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProduct(limit, page, sort, filter);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: 'Error',
        message: 'The productId is required',
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const deleteManyProduct = async (req, res) => {
  try {
    const data = req.body;
    if (!data?.ids) {
      return res.status(400).json({
        status: 'Error',
        message: 'The ids is required',
      });
    }
    const response = await ProductService.deleteManyProduct(data?.ids);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  getAllTypeProduct,
  getAllProduct,
  deleteProduct,
  deleteManyProduct,
};
