const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const reg =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const isValidEmail = reg.test(email);
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Please fill all the fields',
      });
    } else if (!isValidEmail) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Email is not valid',
      });
    } else if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Passwords do not match',
      });
    }
    const data = await UserService.createUser(req.body);
    return res.status(200).json(data);
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ message: err });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const isValidEmail = reg.test(email);
    if (!email || !password) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Please fill all the fields',
      });
    } else if (!isValidEmail) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Email is not valid',
      });
    }
    const response = await UserService.loginUser(req.body);

    if (response.status === 'ERR') {
      return res.status(401).json({
        status: 'ERR',
        message: response.message,
      });
    }

    const { refresh_token, ...newResponse } = response;
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    return res.status(200).json({ ...newResponse, refresh_token });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;
    const reg =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const isValidEmail = reg.test(email);

    if (!email || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Please fill all the fields',
      });
    } else if (!isValidEmail) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Email is not valid',
      });
    } else if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Passwords do not match',
      });
    }

    const data = await UserService.resetPassword(req.body);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie('refresh_token');
    return res.status(200).json({
      status: 'OK',
      message: 'Logout Success',
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(400).json({
        status: 'Error',
        message: 'The userId is required',
      });
    }
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: 'Error',
        message: 'The userId is required',
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const deleteManyUser = async (req, res) => {
  try {
    const data = req.body;
    if (!data?.ids) {
      return res.status(400).json({
        status: 'Error',
        message: 'The ids are required',
      });
    }
    const response = await UserService.deleteManyUser(data?.ids);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: 'Error',
        message: 'The userId is required',
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const refreshToken = async (req, res) => {
  try {
    let token = req.headers.token.split(' ')[1];
    if (!token) {
      return res.status(400).json({
        status: 'Error',
        message: 'The token is required',
      });
    }
    const response = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports = {
  createUser,
  loginUser,
  resetPassword,
  logoutUser,
  updateUser,
  deleteUser,
  deleteManyUser,
  getAllUser,
  getDetailsUser,
  refreshToken,
};
