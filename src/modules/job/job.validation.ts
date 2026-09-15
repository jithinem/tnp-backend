import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const createJobSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  company_name: Joi.string().trim().min(1).max(200).required(),
  location: Joi.string().trim().min(1).max(150).required(),
  description: Joi.string().trim().min(1).required(),
  requirements: Joi.string().trim().min(1).required(),
  salary_min: Joi.number().min(0).optional(),
  salary_max: Joi.number().min(0).optional(),
  experience_level: Joi.string().trim().min(1).max(100).required(),
  category_id: Joi.number().integer().positive().required(),
  employment_type: Joi.string().trim().min(1).max(100).required(),
  is_featured: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
}).options({ allowUnknown: false });

const updateJobSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional(),
  company_name: Joi.string().trim().min(1).max(200).optional(),
  location: Joi.string().trim().min(1).max(150).optional(),
  description: Joi.string().trim().min(1).optional(),
  requirements: Joi.string().trim().min(1).optional(),
  salary_min: Joi.number().min(0).optional(),
  salary_max: Joi.number().min(0).optional(),
  experience_level: Joi.string().trim().min(1).max(100).optional(),
  category_id: Joi.number().integer().positive().optional(),
  employment_type: Joi.string().trim().min(1).max(100).optional(),
  is_featured: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
}).options({ allowUnknown: false });

const listJobQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  category_id: Joi.number().integer().positive().optional(),
  is_active: Joi.boolean().optional(),
  is_featured: Joi.boolean().optional(),
  employment_type: Joi.string().trim().optional(),
  search: Joi.string().trim().max(200).optional(),
  application_status: Joi.string().valid('PENDING', 'SHORTLISTED', 'REJECTED', 'not-applied', 'applied').optional(),
  user_id: Joi.number().integer().positive().optional(),
}).options({ allowUnknown: true });

const createJobValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error, value } = createJobSchema.validate(request.body, {
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

const updateJobValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error, value } = updateJobSchema.validate(request.body, {
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

const listJobsValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error } = listJobQuerySchema.validate(request.query, {
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

  next();
};

export {
  createJobSchema,
  updateJobSchema,
  listJobQuerySchema,
  createJobValidation,
  updateJobValidation,
  listJobsValidation,
};
