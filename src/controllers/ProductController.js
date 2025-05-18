const ProductService = require('../services/ProductService');

const createProduct = async(req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description } = req.body;
        if(!name || !image || !type || !price || !countInStock || !rating ) {
            return res.status(200).json({ 
                status: "Error",
                message: "Please fill all the fields"
             });
        }
        const response = await ProductService.createProduct(req.body);
        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
        return res.status(404).json({ message: err });
    }
}

const updateProduct = async(req, res) => {
    try {
        const productId = req.params.id;
        const data = req.body;
        if (!productId) {
            return res.status(200).json({ 
                status: "Error",
                message: "The productId is required"
             });
        }
        const response = await ProductService.updateProduct(productId, data);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
}

const getDetailsProduct = async(req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(200).json({ 
                status: "Error",
                message: "The productId is required"
             });
        }
        const response = await ProductService.getDetailsProduct(productId);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
}

const getAllProduct = async(req, res) => {
    try {
        const { limit , page, sort } = req.query;
        const response = await ProductService.getAllProduct(limit , page, sort);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
}

const deleteProduct = async(req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(200).json({ 
                status: "Error",
                message: "The productId is required"
             });
        }
        const response = await ProductService.deleteProduct(productId);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
}


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    getAllProduct,
    deleteProduct
};