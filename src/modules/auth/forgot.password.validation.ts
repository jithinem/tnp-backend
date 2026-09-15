import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().max(150).required(),
}).options({
  allowUnknown: false,
});

const forgotPasswordValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error, value } = forgotPasswordSchema.validate(request.body, {
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

export { forgotPasswordValidation };
