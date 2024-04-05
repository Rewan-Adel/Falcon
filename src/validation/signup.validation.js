const Joi = require('joi');

const schemas = {
    // Validation for email
    email: Joi.object({
        email     : Joi.string().max(100).email().required().trim(),
    }).unknown(),

    // Validation for phone number
    phone: Joi.object({
        phone     : Joi.string().max(14).required().trim(),
    }).unknown(),
    

    // Validation for username
    username: Joi.object({
        username  : Joi.string().max(25).required().trim().alphanum(),
    }).unknown(),

    // Validation for complete profile
    completeData: Joi.object({
        firstName : Joi.string().max(25).required().trim(),
        lastName  : Joi.string().max(25).required().trim(),
        password  : Joi.string().min(6).required().trim(),
        confirmPassword: Joi.string().min(6).required().trim().valid(Joi.ref('password')).messages({'any.only': 'passwords do not match'}),
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