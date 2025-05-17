const ProductModel = require('../models/ProductModel');

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = newProduct;
        try {
            const checkProduct = await ProductModel.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: "OK",
                    message: "The name of product is already",
                })
            }
            const createdProduct = await ProductModel.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description
            });
            if (createdProduct) {
                resolve({
                    status: "OK",
                    message: "Product created successfully",
                    data: createdProduct,
                })
            }
        } catch (err) {
            reject(err);
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await ProductModel.findOne({ 
                _id: id
             })
            if (checkProduct === null) {
                resolve({
                    status: "OK",
                    message: "The Product is not found",
                })
            }

            const updatedProduct = await ProductModel.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: "OK",
                message: "Success",
                data: updatedProduct,
            })
        } catch (err) {
            reject(err);
        }
    })
}


module.exports = {
    createProduct,
    updateProduct
};
