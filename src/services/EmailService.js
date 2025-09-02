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
  const attachImage = [];
  orderItems.forEach((orderItem) => {
    listItem += `<div>
      <div>Bạn đã đặt sản phẩm: ${orderItem.name}</div>
      <div>Số lượng: <b>${orderItem.amount}</b>; Với giá: <b>${orderItem.price} VND</b></div>
      <div>Bên dưới là hình ảnh sản phẩm: </div>
    </div>`;
    attachImage.push({ path: orderItem.image[0], filename: orderItem.name });
  });

  // Wrap in an async IIFE so we can use await.
  (async () => {
    const info = await transporter.sendMail({
      from: `"EroSennin" <${process.env.MAIL_ACCOUNT}>`,
      to: email,
      subject: 'CẢM ƠN BẠN ĐÃ ĐẶT HÀNG TẠI ERO-SHOP',
      text: 'Bạn đã đặt hàng thành công tại Ero_Shop', // plain‑text body
      html: `<div><b>Bạn đã đặt hàng thành công tại Ero_Shop: </b></div> ${listItem}`, // HTML body
      attachments: attachImage,
    });
  })();
};

module.exports = {
  sendEmailCreateOrder,
};
