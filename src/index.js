const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: 'https://erosennin.id.vn', // FE domain
    // origin: 'https://fe-ero-shop-izd5p41db-erosennins-projects-0038b853.vercel.app/', // FE domain
    // origin: '*', // FE domain
    credentials: true,
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true khi production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' cho cross-origin
    },
    name: 'sessionId',
  }),
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(cookieParser());

routes(app);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    // console.log('Connected DB Success !!!');
  })
  .catch((err) => {
    // console.log('Connected DB Failed !!!');
    // console.log(err);
  });

app.listen(port, () => {
  // console.log(`Server is running on http://localhost:${port}`);
});
