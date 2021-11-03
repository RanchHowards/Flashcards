const Joi = require('joi');

module.exports.registrationSchema = Joi.object({
    username: Joi.string()
        .required(),
    email: Joi.string()
        .required,
    password: Joi.string()
        .email()
        .required()
});