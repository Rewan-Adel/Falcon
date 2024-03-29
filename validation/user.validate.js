const Joi = require('joi');

const signupValidation = (user)=>{
    const userSchema = Joi.object({
        firstName : Joi.string().max(25).required().trim(),
        lastName  : Joi.string().max(25).required().trim(),
        phone     : Joi.string().max(14).required().trim(),
        email     : Joi.string().max(100).email().required().trim(),
    }).unknown();

    let { error, value }= userSchema.validate(user);

    return { error, value };
};

module.exports = {
    signupValidation
}