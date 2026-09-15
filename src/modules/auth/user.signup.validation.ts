import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const signupSchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required(),

  last_name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required(),

  email: Joi.string()
    .email()
    .max(150)
    .required(),

  password: Joi.string()
    .min(8)
    .max(200)
    .required(),

  phone_number: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]*$/)
    .max(20)
    .optional(),
}).options({
  allowUnknown: false,
});

const userSignupValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error, value } = signupSchema.validate(request.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    response.status(400).json({
      success: false,
      message: 'Validation failed',
      data: error.details.map((detail) => detail.message),
    });

    return;
  }

  request.body = value;

  next();
};

export { userSignupValidation };
