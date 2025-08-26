const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.token.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: 'The Authentication',
        status: 'Error',
      });
    }
    if (user?.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        message: 'The Authentication',
        status: 'Error',
      });
    }
  });
};

const authUserMiddleware = (req, res, next) => {
  const token = req.headers.token.split(' ')[1];
  const userId = req.params.id;
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: 'The Authentication',
        status: 'Error',
      });
    }
    if (user?.isAdmin || user?.id === userId) {
      next();
    } else {
      return res.status(403).json({
        message: 'The Authentication',
        status: 'Error',
      });
    }
  });
};

const otpMiddleware = (req, res, next) => {
  const { otp, email } = req.body;
  if (!otp || !email) {
    return res.status(400).json({
      message: 'Missing OTP or email',
      status: 'Error',
    });
  }
  let existingIndex = 0;
  let otpToken = '';
  if (Array.isArray(req.session.otpData)) {
    existingIndex = req.session.otpData.findIndex((item) => item.email === email);
    if (existingIndex !== -1) {
      otpToken = req.session.otpData[existingIndex].otpToken;
    }
  }
  jwt.verify(otpToken, process.env.OTP_TOKEN, function (err, otpEmail) {
    if (err) {
      return res.status(401).json({
        message: 'The Authentication',
        status: 'Error',
      });
    }
    if (otpEmail?.email === email && otpEmail?.otp === otp) {
      next();
    } else {
      return res.status(403).json({
        message: 'The OTP is invalid',
        status: 'Error',
      });
    }
  });
};

module.exports = {
  authMiddleware,
  authUserMiddleware,
  otpMiddleware,
};
