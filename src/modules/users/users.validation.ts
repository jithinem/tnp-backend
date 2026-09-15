import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const createUserSchema = Joi.object({
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required(),
  role: Joi.string().valid('admin', 'applicant').required(),
  is_active: Joi.boolean().optional(),
}).options({ allowUnknown: false });

const updateUserSchema = Joi.object({
  first_name: Joi.string().trim().optional(),
  last_name: Joi.string().trim().optional(),
  email: Joi.string().trim().email().optional(),
  password: Joi.string().trim().min(6).optional(),
  role: Joi.string().valid('admin', 'applicant').optional(),
  is_active: Joi.boolean().optional(),
}).options({ allowUnknown: false });

const listUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  role: Joi.string().valid('admin', 'applicant').optional(),
  search: Joi.string().trim().optional(),
  is_active: Joi.boolean().optional(),
}).options({ allowUnknown: true });

const createUserValidation = (request: Request, response: Response, next: NextFunction): void => {
  const { error, value } = createUserSchema.validate(request.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    response.status(400).json({ success: false, message: 'Validation failed', data: error.details.map((detail) => detail.message) });
    return;
  }
  request.body = value;
  next();
};

const updateUserValidation = (request: Request, response: Response, next: NextFunction): void => {
  const { error, value } = updateUserSchema.validate(request.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    response.status(400).json({ success: false, message: 'Validation failed', data: error.details.map((detail) => detail.message) });
    return;
  }
  request.body = value;
  next();
};

const listUsersValidation = (request: Request, response: Response, next: NextFunction): void => {
  const { error, value } = listUsersQuerySchema.validate(request.query, { abortEarly: false, stripUnknown: true });
  if (error) {
    response.status(400).json({ success: false, message: 'Validation failed', data: error.details.map((detail) => detail.message) });
    return;
  }
  next();
};

export { createUserValidation, updateUserValidation, listUsersValidation };
