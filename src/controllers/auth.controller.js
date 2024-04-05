const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const {emailValidation, completeValidation, usernameValidation} = require('../validation/signup.validation');
const {generateToken} = require('../utils/auth.token');
const {sendCodeToEmail} = require('../utils/verificationCode');
const {
    serverErrorMessage,
    notFoundErrorMessage,
    badRequestMessage
} = require('../middlewares/error.messages.middleware');


const registerByEmail = async(req, res, next)=>{
    try{
        let { error, value } = emailValidation(req.body);
        if(error) return badRequestMessage(error.message, res);


        let user = await User.findOne({where: {email: value.email}});
        if( user ) return badRequestMessage('Email already exists', res);

        user = await User.create(value);
        await sendCodeToEmail(user);

        let token = await generateToken(user.userID, res);
        return res.status(201).json({
            status: 'success',
            code: 201,
            message: 'Verification code sent.',
            token: token
        });
    }catch(error){
        console.log('Error in auth.controller.js: ',error);
        serverErrorMessage(error, res);
    }
};

const verifyCode = async(req, res, next)=>{
    try{
        let {otp} = req.body;
        let {user} = req;
        if(!otp) return badRequestMessage('Verification code is required.', res);
        
        const isMatch = await bcrypt.compare(otp, user.otp);
        if(!isMatch) return badRequestMessage('Invalid verification code', res);
        
        if(user.otpExpires < Date.now()) return badRequestMessage('Verification code has expired.', res);
        
        await user.update({isVerified: true, otp: null, otpCount: 0, otpExpires: null});

        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'User has been verified.'
        });
    }catch(error){
        console.log('Error in auth.controller.js: ',error);
        next(serverErrorMessage(error, res));
    }
};

const resendCode = async(req, res, next)=>{
    try{
        let {user} = req;
        if(user.otpCount > 5) return badRequestMessage('Verification code limit exceeded.', res);

        await sendCodeToEmail(user);
        
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Verification code sent.'
        });
    }catch(error){
        console.log('Error in auth.controller.js: ',error);
        next(serverErrorMessage(error, res));
    }

}


const completeProfile = async(req, res, next)=>{
    try{
        let {user} = req;
        let {error, value} = completeValidation(req.body);
        if(error) return  badRequestMessage(error.message, res);

        await user.update(value);
        
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Profile has been completed.',
            user: user.toJSON()
        });

    }catch(error){
        console.log('Error in auth.controller.js: ',error);
        next(serverErrorMessage(error, res));
    }
}

const createUsername = async(req, res, next)=>{
    try{
        let {error, value} = usernameValidation(req.body);
        if(error) return badRequestMessage(error.message, res);

        let {user} = req;
        await user.update(value);
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Username has been created.',
            user: user.toJSON()
        });
    }
    catch(error){
        console.log('Error in auth.controller.js: ',error);
        next(serverErrorMessage(error, res));
    }
};


module.exports = {
    registerByEmail,
    verifyCode,
    completeProfile,
    createUsername,
    resendCode
};