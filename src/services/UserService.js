const UserModel = require('../models/UserModel');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;
        try {
            const checkUser = await UserModel.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: "OK",
                    message: "The Email is already",
                })
            }
            const createdUser = await UserModel.create({
                name,
                email,
                password,
                confirmPassword,
                phone
            });
            if (createdUser) {
                resolve({
                    status: "OK",
                    message: "User created successfully",
                    data: createdUser,
                })
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

module.exports = {
    createUser
};
