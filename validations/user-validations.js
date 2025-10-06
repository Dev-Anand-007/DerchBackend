const Joi = require("joi");

const userValidation = {
  registerUser: Joi.object({
    fullname: Joi.string()
      .min(3)
      .max(50)
      .trim()
      .required()
      .messages({
        "string.min": "Full name must be at least 3 characters long",
        "string.max": "Full name cannot exceed 50 characters",
        "any.required": "Full name is required",
        "string.empty": "Full name cannot be empty",
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),

    phone: Joi.string()
      .pattern(/^[0-9+\- ]+$/)
      .min(8)
      .max(15)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number can only contain digits, +, - and spaces",
        "string.min": "Phone number must be at least 8 characters long",
        "string.max": "Phone number cannot exceed 15 characters",
        "any.required": "Phone number is required",
      }),

    address: Joi.object({
      street: Joi.string().trim().allow("").optional(),
      city: Joi.string().trim().allow("").optional(),
      state: Joi.string().trim().allow("").optional(),
      postalCode: Joi.string().trim().allow("").optional(),
      country: Joi.string().trim().default("India"),
    }).optional(),

    password: Joi.string()
      .min(4)
      .required()
      .messages({
        "string.min": "Password must be at least 4 characters long",
        "any.required": "Password is required",
      }),

    contact: Joi.number()
      .integer()
      .min(1000000000) // at least 10 digits
      .max(99999999999999) // max 14 digits
      .optional()
      .messages({
        "number.min": "Contact number must be at least 10 digits",
        "number.max": "Contact number cannot exceed 14 digits",
        "number.base": "Contact must be a valid number",
      }),

  
  }),
};

module.exports = userValidation;
