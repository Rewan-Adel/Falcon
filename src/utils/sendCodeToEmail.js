const Email = require('./Email');
const bcrypt = require('bcrypt');

exports.sendVerifyEmail = async(user)=>{
    try{
        let otp = generateCode();
        await verifyMail(user.email, otp);

        let hashedOtp = await bcrypt.hashSync(otp, 10);
        await updateUserOtp(user, hashedOtp);

    }catch(error){
        console.error(error);
    }
};

exports.resetPasswordEmail = async(user, url)=>{
    try{
        let otp = generateCode();
        await sendResetPassMail(user.email, url);

        let hashedOtp = await hashOtp(otp);
        await updateUserPass(user, hashedOtp);

    }catch(error){
        console.error(error);
    }
};

const generateCode = () => {   
    const otp = Math.floor( Math.random() * 900000);
    return otp.toString();
}

const verifyMail = async(email, otp)=>{
    let sendMail = new Email(email);
    await sendMail.verificationEmail(otp);
};

const sendResetPassMail = async(email, otp)=>{
    let sendMail = new Email(email);
    await sendMail.resetPassword(url);
}

const updateUserOtp = async(user, hashedOtp)=>{
    await user.update({
        otp: hashedOtp,
        otpCount: user.otpCount + 1,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000)
    });

    await user.save();

};

const updateUserPass = async(user, hashedPass)=>{
    await user.update({
        password        : hashedPass,
        confirmPassword : undefined,
        passChangedAt   : Date.now(),
        passResetToken  : undefined,
        passResetExpires: undefined
    });

    await user.save();
};
