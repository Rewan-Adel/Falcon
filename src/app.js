const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

const {notFoundErrorMessage} = require('./middlewares/error.messages.middleware')

const authRouter = require('./routes/auth.route');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

app.all('*', (req, res) => {
    return notFoundErrorMessage(`Can't find ${req.originalUrl} on this server!`, res);
});

module.exports = app;