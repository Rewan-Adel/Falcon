const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const {sendCodeToEmail} = require('../utils/sendMail');
const {stepOneValidation} = require('../validation/signup.validation');

const {
    serverErrorMessage,
    notFoundErrorMessage,
    badRequestMessage
} = require('../middlewares/error.messages.middleware');

const registerUser = async(field, value)=>{
    let user = await User.findOne({where: {[field]: value}});
    if(user) return `exists`;

    user = await User.create({[field]: value});
    return user;
}

const initialRegister = async (req, res) => {
    const method = req.params.method;
    let user, otp;
    try{
        let {error, value} = stepOneValidation(req);
        if(error) return badRequestMessage(error.message, res);

        if(method === 'email') {
            user = await registerUser('email', value.email);
            if(user == 'exists') return badRequestMessage('Email already exists.', res);
            otp  = await sendCodeToEmail(user);
        }
        
        else if(method === 'phone') {
            user = await registerUser('phone', value.phone);
            otp = await sendCodeToPhone(user);
            if(user == 'exists') return badRequestMessage('Phone number already exists.', res);
        }
        else return badRequestMessage('Invalid register way.', res);
        
        otp  = await bcrypt.hashSync(otp, 10);
        await user.update({otp: otp});

        setTimeout(async ()=>{
            user.update({otp: null})
        }, 15 * 60 *1000);  

        return res.status(201).json({
            status: 'success',
            code: 201,
            message: 'verification code has been sent.'
        });
    }catch(error){
        console.log('Error in auth.controller.js: ',error);
        serverErrorMessage(error, res);
    }
};

module.exports = {initialRegister};