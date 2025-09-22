const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers?.token.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: 'The Authentication',
        status: 'ERR',
      });
    }
    if (user?.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        message: 'The Authentication',
        status: 'ERR',
      });
    }
  });
};

const authUserMiddleware = (req, res, next) => {
  const token = req.headers?.token.split(' ')[1];
  const userId = req.params?.id;
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: 'The Authentication',
        status: 'ERR',
      });
    }
    if (user?.isAdmin || user?.id === userId) {
      next();
    } else {
      return res.status(403).json({
        message: 'The Authentication',
        status: 'ERR',
      });
    }
  });
};

const authUserOrderMiddleware = (req, res, next) => {
  const token = req.headers?.token.split(' ')[1];
  const userId = req.body?.user;
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: 'The Authentication',
        status: 'ERR',
      });
    }
    if (user?.isAdmin || user?.id === userId) {
      next();
    } else {
      return res.status(403).json({
        message: 'The Authentication',
        status: 'ERR',
      });
    }
  });
};

const otpMiddleware = (req, res, next) => {
  const { otp, email } = req.body;
  const reg =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const isValidEmail = reg.test(email);
  if (!isValidEmail) {
    return res.status(400).json({
      message: 'Email is not valid',
      status: 'ERR',
    });
  }
  if (!otp || !email) {
    return res.status(400).json({
      message: 'Missing OTP or email',
      status: 'ERR',
    });
  }
  let existingIndex = 0;
  let otpToken = '';
  if (Array.isArray(req.session?.otpData)) {
    existingIndex = req.session?.otpData.findIndex((item) => item.email === email);
    if (existingIndex !== -1) {
      otpToken = req.session?.otpData[existingIndex].otpToken;
    }
  }
  jwt.verify(otpToken, process.env.OTP_TOKEN, function (err, otpEmail) {
    if (err) {
      return res.status(401).json({
        message: 'The Authentication',
        status: 'ERR',
      });
    }
    if (otpEmail?.email === email && otpEmail?.otp === otp) {
      next();
    } else {
      return res.status(403).json({
        message: 'The OTP is invalid',
        status: 'ERR',
      });
    }
  });
};

module.exports = {
  authMiddleware,
  authUserMiddleware,
  authUserOrderMiddleware,
  otpMiddleware,
};
