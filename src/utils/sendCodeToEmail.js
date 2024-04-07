const Email = require('./Email');
const bcrypt = require('bcrypt');

const generateCode = () => {   
    const otp = Math.floor( Math.random() * 900000);
    return otp.toString();
}

const sendMail = async(email, otp)=>{
    let sendMail = new Email(email);
    await sendMail.verificationEmail(otp);
}

const hashOtp = async(otp)=>{
    return await bcrypt.hashSync(otp, 10);
}

const updateUser = async(user, hashedOtp)=>{
    await user.update({
        otp: hashedOtp,
        otpCount: user.otpCount + 1,
        otpExpires: new Date(Date.now() + 15 * 60 * 1000)
    });
}

module.exports =  async(user)=>{
    try{  
        let otp = generateCode();
        await sendMail(user.email, otp);

        let hashedOtp = await hashOtp(otp);
        await updateUser(user, hashedOtp);
        
    }catch(error){
    console.error(error);
}};
