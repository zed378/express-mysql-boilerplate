const Joi = require("joi");

exports.inputValidation = Joi.object({
  firstName: Joi.string().min(3),
  lastName: Joi.string().min(3),
  email: Joi.string().email().min(6),
  password: Joi.string().min(3),
  user: [Joi.string().min(3), Joi.string().email().min(6)],
  otp: Joi.number().min(6),
});
