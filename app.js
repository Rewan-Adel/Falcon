const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan'); // logging

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.all('*', (req, res) => {
    return res.status(404).json({
        status: 'fail',
        code  : 404,
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

module.exports = app;