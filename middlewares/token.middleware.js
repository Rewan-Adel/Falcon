const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { serverErrorMessage,badRequestMessage, notFoundErrorMessage } = require('./error.messages.middleware');

module.exports = async(req, res, nxt)=>{
    try{
        const token = req.cookies.token || req.header('Authorization') || req.header('Authorization').replace("Bearer ", " ");
        if(!token) return badRequestMessage("Please login to get access");

        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            userID : decoded.id
        });

        if(!user) return notFoundErrorMessage("Invalid token");

        req.token = token;
        req.user  = user;
        nxt();
    }
    catch(error){
        console.log('Error at token.middleware file: ', error);
        serverErrorMessage(error);
    }
};