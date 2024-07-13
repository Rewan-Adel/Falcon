const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { google } = require('googleapis');

const {sendVerifyEmail, resetPasswordEmail} = require('../utils/sendCodeToEmail');

const {emailValidation, completeValidation, usernameValidation} = require('../validation/signup.validation');
const {generateToken} = require('../utils/auth.token');
const {
    serverErrorMessage,
    badRequestMessage
} = require('../middlewares/error.messages.middleware');


const register = async(req, res, next)=>{
    try{
        let registerWay = req.params.way;

        switch(registerWay){
            case 'email'  : emailRegister(req, res);   break;
            case 'google' : googleRegister(req, res);  break;
            case 'phone'  : phoneRegister(req, res);   break;
            case 'apple'  : appleRegister(req, res);   break;
            case 'twitter': twitterRegister(req, res); break;
            default:
                return badRequestMessage('Invalid register way.', res);
        };
    
    }catch(error){
        console.log('Error in auth.controller.js, register function: ',error);
        serverErrorMessage(error, res);
    }
};
async function emailRegister(req, res){
    let { error, value } = emailValidation(req.body);
    if(error) return badRequestMessage(error.message, res);


    let user = await User.findOne({where: {email: value.email}});
    if( user ) return badRequestMessage('Email already exists', res);

    user = await User.create(value);
    user.signupWay = 'email';
    await user.save();
    await sendVerifyEmail(user);

    let token = await generateToken(user.userID, res);
    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.status(201).json({
        status: 'success',
        code: 201,
        message: 'Verification code is sent.',
        token: token
    });
}
async function googleRegister(req, res){
    let { error, value } = emailValidation(req.body);
    if(error) return badRequestMessage(error.message, res);

    let user = await User.findOne({where: {email: value.email}});
    if( user ) return res.redirect('/login/google');
    

    user = await User.create(value);
    user.signupWay = 'google';
}
async function phoneRegister(req, res){}
async function appleRegister(req, res){}
async function twitterRegister(req, res){}


const verifyCode = async(req, res, next)=>{
    try{
        let {otp} = req.body;
        let {user} = req;

        if(!otp) return badRequestMessage('Verification code is required.', res);
        
        otp = otp.toString();
        const isMatch = await bcrypt.compare(otp, user.otp);
        if(!isMatch) return badRequestMessage('Invalid verification code', res);
        
        if(user.otpExpires < Date.now()) return badRequestMessage('Verification code has expired.', res);
        
        await user.update({isVerified: true, otp: null, otpCount: 0, otpExpires: null});

        return res.status(200).json({
            status: 'success',
            code: 200,
            isVerified: true,
            message: 'Valid code.'
        });
    }catch(error){
        console.log('Error in auth.controller.js: ',error);
        next(serverErrorMessage(error, res));
    }
};

const resendCode = async(req, res, next)=>{
    try{
        let {user} = req;
        if(user.otpCount >= 5){
            setTimeout( function(){
                user.update({
                    otp       : null,
                    otpCount  : 0,
                    otpExpires: null
                })
            }, 10 * 60 * 1000 );

            return badRequestMessage('Verification code limit exceeded. try again after 10 minutes', res)
        };

        await sendVerifyEmail(user);
        
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Verification code is sent.'
        });
    }catch(error){
        console.log('Error in auth.controller.js: ',error);
        next(serverErrorMessage(error, res));
    }

};

const completeProfile = async(req, res, next)=>{
    try{
        let {user} = req;
        let {error, value} = completeValidation(req.body);
        if(error) return  badRequestMessage(error.message, res);
        
        value.password = await bcrypt.hash(value.password, 10);
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
};

const createUsername = async(req, res, next)=>{
    try{
        let {error, value} = usernameValidation(req.body);
        if(error) return badRequestMessage(error.message, res);

        let {user} = req;
        let checkUsername = await User.findOne({
            where: {
                username: value.username
            }
        });
        if(checkUsername) return badRequestMessage("username already exists", res);

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

const login = async(req, res, next)=>{
    try{
        let loginWay = req.params.way;
        if(loginWay == 'email'){
        let { error, value } = emailValidation(req.body);
        if(error) return badRequestMessage(error.message, res);

        let user = await User.findOne({where: {email: value.email}});
        if( !user ) return badRequestMessage('Invalid email.', res);
        await sendVerifyEmail(user);
        
        let token = await generateToken(user.userID, res);
        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' ? true : false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Verification code is sent.',
            token
        });
    }
}catch(error){
    console.log('Error in auth.controller.js: ',error);
    serverErrorMessage(error, res);
}
};

const loginPass = async(req, res, next)=>{
    try{
        let {password} = req.body;
        let {user} = req;
        
        if(!password) return badRequestMessage('Password is required.', res);

        let checkPass = await bcrypt.compare(password, user.password);
        if(!checkPass) return badRequestMessage("Invalid Password", res);

        return res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Login successfully.',
        });
    
}catch(error){
    console.log('Error in auth.controller.js: ',error);
    serverErrorMessage(error, res);
}
};

const resetPassword = async(req, res, next)=>{
    try{
        let {way} = req.params;
        if(way == 'email'){
            let {email} =  req.body;
            let user = await User.findOne({
                where:{
                    email 
                }
            });

            if(! user) return badRequestMessage("Invalid email", res);
            
            let token = crypto.randomBytes(32).toString('hex');
            
            let url = `${req.protocol}://${req.get('host')}/reset-password`;
            await resetPasswordEmail(user, url);


            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Reset password link is sent to your email.'
            });
        }
        
    }catch(error){ 
        console.log('Error in auth.controller.js: ',error);
        serverErrorMessage(error, res);
    }
};

module.exports = {
    register,
    verifyCode,
    completeProfile,
    createUsername,
    resendCode,
    login, loginPass
};