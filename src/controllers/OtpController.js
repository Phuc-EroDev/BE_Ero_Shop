const OtpService = require('../services/OtpService');

const sendOtp = async (req, res) => {
  const { email } = req.body;
  const reg =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const isValidEmail = reg.test(email);
  if (!isValidEmail) {
    return res.status(400).json({
      status: 'ERR',
      message: 'Email is not valid',
    });
  }
  const data = await OtpService.sendOtp(email);
  if (data.status === 'OK') {
    if (!req.session.otpData) {
      req.session.otpData = [];
    }

    const existingIndex = req.session.otpData.findIndex((item) => item.email === email);

    if (existingIndex !== -1) {
      req.session.otpData[existingIndex].otpToken = data.otpToken;
    } else {
      req.session.otpData.push({ email, otpToken: data.otpToken });
    }

    return res.status(200).json({
      status: 'OK',
      message: data.message,
    });
  } else {
    return res.status(400).json(data);
  }
};

module.exports = {
  sendOtp,
};
