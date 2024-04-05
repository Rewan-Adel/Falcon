const Joi = require('joi');

const schemas = {
    email: Joi.object({
        email     : Joi.string().max(100).email().required().trim(),
    }).unknown(),

    phone: Joi.object({
        phone     : Joi.string().max(14).required().trim(),
    }).unknown()
}


const stepOneValidation = (req)=>{
    let method = req.params.method;
    let userSchema;

    if(method === 'email') userSchema = schemas.email;
    else if(method === 'phone') userSchema = schemas.phone;
    
    else return { error: { message: 'Invalid register way.' }, value: null };

    let { error, value } = userSchema.validate(req.body);

    return { error, value };
};

module.exports = {
    stepOneValidation
}