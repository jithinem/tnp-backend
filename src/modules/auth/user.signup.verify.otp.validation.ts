import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const verifySignupOtpSchema = Joi.object({
  email: Joi.string().email().max(150).required(),
  otp: Joi.string().trim().min(6).max(8).required(),
}).options({
  allowUnknown: false,
});

const userSignupVerifyOtpValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error, value } = verifySignupOtpSchema.validate(request.body, {
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

export { userSignupVerifyOtpValidation };
