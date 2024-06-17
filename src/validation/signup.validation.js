const Joi = require('joi');

const schemas = {
    email: Joi.object({
        email     : Joi.string().max(100).email().required().trim(),
    }).unknown(),

    phone: Joi.object({
        phone     : Joi.string().max(14).required().trim(),
    }).unknown(),
    
    username: Joi.object({
        username  : Joi.string().min(5).max(25).required().trim().alphanum().messages({
            "string.empty": "username is required."
        }),
    }).unknown(),

    completeData: Joi.object({
        firstName : Joi.string().max(25).required().trim().messages({
            "string.empty": "First name is required."
        }),
        lastName  : Joi.string().max(25).required().trim().messages({
            "string.empty": "Last name is required."
        }),
        password  : Joi.string().min(6).required().trim().messages({
            "string.empty": "Password is required."
        }),
        confirmPassword: Joi.string().min(6).required().trim().valid(Joi.ref('password')).messages({ "string.empty": "Confirm password is required.", 'any.only': 'Passwords do not match'}),
    }).unknown()
}

// Function to validate email
const emailValidation = (req)=>{
    let emailSchema = schemas.email;
    let { error, value } = emailSchema.validate(req);
    return { error, value };
};

// Function to validate complete profile
const completeValidation = (req)=>{
    let userSchema = schemas.completeData;
    let{error, value} = userSchema.validate(req);

    return {error, value}
}

// Function to validate username
const usernameValidation = (req)=>{
    let usernameSchema = schemas.username;
    let { error, value } = usernameSchema.validate(req);
    return { error, value };
};

module.exports = {
    emailValidation,
    completeValidation,
    usernameValidation
}