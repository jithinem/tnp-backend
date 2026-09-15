import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .max(150)
    .required(),

  password: Joi.string()
    .min(8)
    .max(200)
    .required(),
}).options({
  allowUnknown: false,
});

const userLoginValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error, value } = loginSchema.validate(request.body, {
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

export { userLoginValidation };
