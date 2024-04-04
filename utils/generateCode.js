module.exports = () => {   
    const otp = Math.floor( Math.random() * 900000);
    return otp.toString();
}

