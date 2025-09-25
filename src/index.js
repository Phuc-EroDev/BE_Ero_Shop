const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const corsOptions = require('./configs/corsConfig');
// const sessionConfig = require('./configs/sessionConfig');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors(corsOptions),
);
// sessionConfig(app);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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
