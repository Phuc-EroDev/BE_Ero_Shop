const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const sendOtp = async (email) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpToken = jwt.sign(
    {
      email: email,
      otp: otp.toString(),
    },
    process.env.OTP_TOKEN,
    { expiresIn: '5m' },
  );

  try {
    (async () => {
      const info = await transporter.sendMail({
        from: `"EroSennin" <${process.env.MAIL_ACCOUNT}>`,
        to: email,
        subject: 'ĐÂY LÀ OTP CỦA BẠN TẠI ERO-SHOP',
        text: 'Không chia sẻ mã OTP này cho bất kỳ ai khác!!!',
        html: `<div><b>Không chia sẻ mã OTP này cho bất kỳ ai khác!!!</b><div><b>Mã OTP của bạn là: ${otp}</b></div><div>Mã OTP sẽ hết hạn sau 5 phút</div></div>`,
      });
    })();

    return {
      status: 'OK',
      message: 'OTP đã được gửi thành công',
      otpToken: otpToken,
    };
  } catch (err) {
    return {
      status: 'ERR',
      message: 'Không thể gửi OTP. Vui lòng thử lại sau.',
    };
  }
};

module.exports = {
  sendOtp,
};
