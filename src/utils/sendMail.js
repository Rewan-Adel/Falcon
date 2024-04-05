const sgMail = require('@sendgrid/mail');
const generateCode = require('./generateCode');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendCodeToEmail = async (user) =>{
    const otp = generateCode();
    const msg =  `<h2> Verify your email </h2>
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="margin-top: 20px;">
        <h3 style="color: #000; font-weight: bold;"Falconion<br></h3>
        <p style="color: #666;">Your verification code is:<br></p>
        <p style="color: #333; font-size: 24px; font-weight: bold;">${otp}</p>
        <p style="color: #666;">Please note that otp becomes invalid after 1:30 hours.</p>`;

    await sendEmail(user, msg);
    return otp; 
};

const sendEmail = async(user, msg)=>{
    if (!user || !user.email) {
        throw new Error('User or user email is not defined');
    }

    const email = {
        to: user.email,
        from: process.env.EMAIL_FROM,
        subject: 'Falconion',
        text: 'Verify your email',
        html: msg
    };
    await sgMail.send(email);
}
module.exports ={
    sendCodeToEmail
}