const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).trim().required().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name cannot be empty.",
    "string.min": "Name must be at least {#limit} characters long.",
    "string.max": "Name cannot exceed {#limit} characters.",
    "any.required": "Name is required.",
  }),

  phone: Joi.string()
    .pattern(/^09[0-9]{9}$/)
    .required()
    .messages({
      "string.empty": "Phone number cannot be empty.",
      "string.pattern.base":
        "Phone number must start with 09 and be 11 digits long.",
      "any.required": "Phone number is required.",
    }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email cannot be empty.",
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),

  password: Joi.string()
    .min(6)
    .max(100)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/
    )
    .required()
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password must be at least {#limit} characters long.",
      "string.max": "Password cannot exceed {#limit} characters.",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),
});

const loginSchema = Joi.object({
  identifier: Joi.alternatives()
    .try(
      Joi.string()
        .email()
        .messages({ "string.email": "Invalid email format." }),
      Joi.string()
        .pattern(/^09[0-9]{9}$/)
        .messages({ "string.pattern.base": "Invalid phone number format." })
    )
    .required()
    .messages({
      "any.required": "Identifier (email or phone number) is required.",
      "alternatives.match": "Identifier must be a valid email or phone number.",
    }),

  password: Joi.string()
    .min(6)
    .max(100)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/
    )
    .required()
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password must be at least {#limit} characters long.",
      "string.max": "Password cannot exceed {#limit} characters.",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character.",
      "any.required": "Password is required.",
    }),
});

const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email cannot be empty.",
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.base": "Token must be a string.",
    "string.guid": "Token must be a valid UUID.",
    "any.required": "Token is required.",
  }),

  password: Joi.string()
    .min(6)
    .max(100)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/
    )
    .required()
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password must be at least {#limit} characters long.",
      "string.max": "Password cannot exceed {#limit} characters.",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character.",
      "any.required": "Password is required.",
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
};
