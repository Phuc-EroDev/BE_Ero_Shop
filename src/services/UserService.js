const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService');

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;
    try {
      const checkUser = await UserModel.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: 'ERR',
          message: 'The Email is already',
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const createdUser = await UserModel.create({
        name,
        email,
        password: hash,
        phone,
      });
      if (createdUser) {
        resolve({
          status: 'OK',
          message: 'User created successfully',
          data: createdUser,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await UserModel.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: 'ERR',
          message: 'The User is not found',
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        resolve({
          status: 'ERR',
          message: 'The Password or User is not correct',
        });
      }
      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      resolve({
        status: 'OK',
        message: 'Success',
        access_token,
        refresh_token,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await UserModel.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: 'OK',
          message: 'The User is not found',
        });
      }

      const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: 'OK',
        message: 'Success',
        data: updatedUser,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await UserModel.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: 'OK',
          message: 'The User is not found',
        });
      }

      await UserModel.findByIdAndDelete(id);
      resolve({
        status: 'OK',
        message: 'Delete user Success',
      });
    } catch (err) {
      reject(err);
    }
  });
};

const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await UserModel.deleteMany({ _id: { $in: ids } });
      resolve({
        status: 'OK',
        message: 'Delete user Success',
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await UserModel.find();
      resolve({
        status: 'OK',
        message: 'Success',
        data: allUser,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findOne({
        _id: id,
      });
      if (user === null) {
        resolve({
          status: 'OK',
          message: 'The User is not found',
        });
      }

      resolve({
        status: 'OK',
        message: 'Success',
        data: user,
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  deleteManyUser,
  getAllUser,
  getDetailsUser,
};
