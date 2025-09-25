const dotenv = require('dotenv');
dotenv.config();

const whitelistDomains = ['https://erosennin.id.vn', 'http://localhost:5173'];

const corsOptions = (app) => {
    origin: (origin, callback) => {
        if (!origin && process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }

        if (whitelistDomains.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS policy'));
    }
};

module.exports = corsOptions;
