const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.all('*', (req, res) => {
    return res.status(404).json({
        status: 'fail',
        code  : 404,
        message: `${req.originalUrl} route un-available!`
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({
        status: 'error',
        code  : 500,
        message: process.env.NODE_ENV === 'production' ? 'Internal Server Error!' : err.message
    });
})


module.exports = app;