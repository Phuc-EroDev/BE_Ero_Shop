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
                return;
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

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await ProductModel.findOne({ 
                _id: id
             })
            if (product === null) {
                resolve({
                    status: "OK",
                    message: "The Product is not found",
                })
            }

            resolve({
                status: "OK",
                message: "Success",
                data: product,
            })
        } catch (err) {
            reject(err);
        }
    })
}

const getAllTypeProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allTypeProduct = await ProductModel.distinct("type");
            resolve({
                status: "OK",
                message: "Success",
                data: allTypeProduct,
            })
        } catch (err) {
            reject(err);
        }
    })
}

const getAllProduct = (limit = 8, page = 0, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await ProductModel.countDocuments();
            if (sort && filter) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0];
                const objectFilter = {};
                objectFilter[filter[0]] = { '$regex': filter[1], $options: 'i' };
                const allProductSortFilter = await ProductModel.find(objectFilter).limit(limit).skip(page * limit).sort(objectSort);
                return resolve({
                    status: "OK",
                    message: "Success",
                    data: allProductSortFilter,
                    total: totalProduct,
                    pageCurrent: parseInt(page) + 1,
                    totalPage: Math.ceil(totalProduct / limit),
                })
            }
            if (filter) {
                const objectFilter = {};
                objectFilter[filter[0]] = { '$regex': filter[1], $options: 'i' };
                const allProductFilter = await ProductModel.find(objectFilter).limit(limit).skip(page * limit);
                return resolve({
                    status: "OK",
                    message: "Success",
                    data: allProductFilter,
                    total: totalProduct,
                    pageCurrent: parseInt(page) + 1,
                    totalPage: Math.ceil(totalProduct / limit),
                })
            }
            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0];
                const allProductSort = await ProductModel.find().limit(limit).skip(page * limit).sort(objectSort);
                return resolve({
                    status: "OK",
                    message: "Success",
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: parseInt(page) + 1,
                    totalPage: Math.ceil(totalProduct / limit),
                })
            }
            const allProduct = await ProductModel.find().limit(limit).skip(page * limit);
            resolve({
                status: "OK",
                message: "Success",
                data: allProduct,
                total: totalProduct,
                pageCurrent: parseInt(page) + 1,
                totalPage: Math.ceil(totalProduct / limit),
            })
        } catch (err) {
            reject(err);
        }
    })
}

const deleteProduct = (id) => {
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

            await ProductModel.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Delete product Success",
            })
        } catch (err) {
            reject(err);
        }
    })
}

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await ProductModel.deleteMany({_id: {$in: ids}});
            resolve({
                status: "OK",
                message: "Delete many product Success",
            })
        } catch (err) {
            reject(err);
        }
    })
}


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    getAllTypeProduct,
    getAllProduct,
    deleteProduct,
    deleteManyProduct
};
