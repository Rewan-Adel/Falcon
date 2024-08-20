const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class Email {
    constructor(to){
        this.from    = process.env.EMAIL_FROM;
        this.to      = to;
        this.subject = 'Falconion'
    };

    async send(msg){
        try{
            await sgMail.send(msg);
        }catch(error){
            console.log('Error in Email.js: ', error);
        }
    }

    async verificationEmail(otp){
        const htmlContent = `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="margin-top: 20px;">
        <h3 style="color: #000; font-weight: bold;"Falconion<br></h3>
        <p style="color: #666;">Your verification code is:<br></p>
        <p style="color: #333; font-size: 24px; font-weight: bold;">${otp}</p>
        <p style="color: #666;">valid for only  5  minutes.</p>`

        return await this.send({
            from   : this.from,
            to     : this.to,
            subject: this.subject,
            text   : 'Verify your email',
            html   :  htmlContent
        });
    };

    async resetPassword(url){
        const htmlContent =  `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="margin-top: 20px;">
        <h3 style="color: #000; font-weight: bold;"Falconion<br></h3>
        <p style="color: #666;">You requested to reset your password.<br></p>
        <p style="color: #666;">Click the link below to reset your password.<br></p>
        <a href="${url}">${url}</a>
        <p style="color: #666;">valid for only  10  minutes.</p>`;

        return await this.send({
            from   : this.from,
            to     : this.to,
            subject: this.subject,
            text   : 'Reset your password',
            html   : htmlContent
        });
    }
};

module.exports = Email;