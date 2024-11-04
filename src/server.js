const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

const {notFoundError} = require('./middlewares/error.messages.middleware')

const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const identityRouter = require('./routes/identity.route');
const marketRouter = require('./routes/market.route');
const postRouter = require('./routes/post.route');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/market', marketRouter);
app.use('/api/identity', identityRouter);
app.use('/api/social/post', postRouter);

app.all('*', (req, res) => {
    return notFoundError(`Can't find ${req.originalUrl} on this server!`, res);
});
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});

module.exports = app;