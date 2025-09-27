const session = require('express-session');

const sessionConfig = (app) => {
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
};

module.exports = sessionConfig;
