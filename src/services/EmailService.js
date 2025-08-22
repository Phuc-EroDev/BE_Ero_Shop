const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let listItem = '';
  orderItems.forEach((orderItem) => {
    listItem += `<div><div><b>${orderItem.name}</b></div><div><img src="${orderItem.image}" alt="${orderItem.name}" /></div><div>Số lượng: <b>${orderItem.amount}</b>; Với giá: <b>${orderItem.price} VND</b></div></div>`;
  });

  // Wrap in an async IIFE so we can use await.
  (async () => {
    const info = await transporter.sendMail({
      from: `"EroSennin" <${process.env.MAIL_ACCOUNT}>`,
      //   to: email, // Use the email passed as an argument
      to: 'dinhtam525126@gmail.com',
      subject: 'CẢM ƠN BẠN ĐÃ ĐẶT HÀNG TẠI ERO-SHOP',
      text: 'Bạn đã đặt hàng thành công tại Ero_Shop', // plain‑text body
      html: `<div><b>Bạn đã đặt hàng thành công tại Ero_Shop: </b></div> ${listItem}`, // HTML body
    });
  })();
};

module.exports = {
  sendEmailCreateOrder,
};
