const UserService = require('../services/UserService');

const createUser = async(req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;
        const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const isValidEmail = reg.test(email);
        if(!name || !email || !password || !confirmPassword || !phone) {
            return res.status(200).json({ 
                status: "Error",
                message: "Please fill all the fields"
             });
        } else if (!isValidEmail) {
            return res.status(200).json({ 
                status: "Error",
                message: "Email is not valid"
             });
        } else if (password !== confirmPassword) {
            return res.status(200).json({ 
                status: "Error",
                message: "Passwords do not match"
            });
        }
        const data = await UserService.createUser(req.body);
        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(404).json({ message: err });
    }
}

const loginUser = async(req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;
        const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const isValidEmail = reg.test(email);
        if(!name || !email || !password || !confirmPassword || !phone) {
            return res.status(200).json({ 
                status: "Error",
                message: "Please fill all the fields"
             });
        } else if (!isValidEmail) {
            return res.status(200).json({ 
                status: "Error",
                message: "Email is not valid"
             });
        } else if (password !== confirmPassword) {
            return res.status(200).json({ 
                status: "Error",
                message: "Passwords do not match"
            });
        }
        const data = await UserService.loginUser(req.body);
        return res.status(200).json(data);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
}

const updateUser = async(req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if (!userId) {
            return res.status(200).json({ 
                status: "Error",
                message: "The userId is required"
             });
        }
        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
}

const deleteUser = async(req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({ 
                status: "Error",
                message: "The userId is required"
             });
        }
        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser
};