const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');

const createUser = async(req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const isValidEmail = reg.test(email);
        if(!email || !password || !confirmPassword) {
            return res.status(400).json({ 
                status: "ERR",
                message: "Please fill all the fields"
             });
        } else if (!isValidEmail) {
            return res.status(400).json({ 
                status: "ERR",
                message: "Email is not valid"
             });
        } else if (password !== confirmPassword) {
            return res.status(400).json({ 
                status: "ERR",
                message: "Passwords do not match"
            });
        }
        const data = await UserService.createUser(req.body);
        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
}

const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const isValidEmail = reg.test(email);
        if(!email || !password) {
            return res.status(400).json({ 
                status: "ERR",
                message: "Please fill all the fields"
             });
        } else if (!isValidEmail) {
            return res.status(400).json({ 
                status: "ERR",
                message: "Email is not valid"
             });
        }
        const response = await UserService.loginUser(req.body);
        const {refresh_token, ...newResponse} = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        })
        return res.status(200).json(newResponse);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const updateUser = async(req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if (!userId) {
            return res.status(400).json({ 
                status: "Error",
                message: "The userId is required"
             });
        }
        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const deleteUser = async(req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ 
                status: "Error",
                message: "The userId is required"
             });
        }
        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const getAllUser = async(req, res) => {
    try {
        const response = await UserService.getAllUser();
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const getDetailsUser = async(req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ 
                status: "Error",
                message: "The userId is required"
             });
        }
        const response = await UserService.getDetailsUser(userId);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

const refreshToken = async(req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if (!token) {
            return res.status(400).json({ 
                status: "Error",
                message: "The token is required"
             });
        }
        const response = await JwtService.refreshTokenJwtService(token);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken
};