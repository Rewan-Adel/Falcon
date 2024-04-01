const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan'); // logging

const {notFoundErrorMessage} = require('./middlewares/error.messages.middleware')
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.all('*', (req, res) => {
    return notFoundErrorMessage(`Can't find ${req.originalUrl} on this server!`);
});

module.exports = app;