const Email = require('./Email');
const bcrypt = require('bcrypt');

const generateCode = () => {   
    const otp = Math.floor( Math.random() * 900000);
    return otp.toString();
}

const sendCodeToEmail = async(user)=>{
    try{  
        let otp = generateCode();
        let sendMail = new Email(user.email);
        await sendMail.verificationEmail(otp);

        let hashedOtp = await bcrypt.hashSync(otp, 10);
        await user.update({
            otp: hashedOtp,
            otpCount: user.otpCount + 1,
            otpExpires: new Date(Date.now() + 15 * 60 * 1000) 
        });
    }catch(error){
    console.error(error);
}};

module.exports = {
    generateCode,
    sendCodeToEmail
};