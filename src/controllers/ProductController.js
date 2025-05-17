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
        const { name, image, type, price, countInStock, rating, description } = req.params.id;
        if(!name || !image || !type || !price || !countInStock || !rating ) {
            return res.status(200).json({ 
                status: "Error",
                message: "Please fill all the fields"
             });
        }
        const response = await ProductService.updateProduct(req.body);
        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
        return res.status(404).json({ message: err });
    }
}


module.exports = {
    createProduct,
    updateProduct
};