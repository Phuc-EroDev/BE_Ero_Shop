const UserService = require('../services/UserService');

const createUser = async(req, res) => {
    try {
        console.log(req.body);
        const data = await UserService.createUser();
        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(404).json({ message: err });
    }
}

module.exports = {
    createUser
};