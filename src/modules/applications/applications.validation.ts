import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const createApplicationSchema = Joi.object({
  job_id: Joi.number().integer().positive().required(),
  cover_letter: Joi.string().trim().max(2000).optional().allow(null),
  resume_url: Joi.string().trim().uri().max(500).optional().allow(null),
  status: Joi.string().valid('PENDING', 'SHORTLISTED', 'REJECTED').optional(),
}).options({ allowUnknown: false });

const updateApplicationSchema = Joi.object({
  job_id: Joi.number().integer().positive().optional(),
  cover_letter: Joi.string().trim().max(2000).optional().allow(null),
  resume_url: Joi.string().trim().uri().max(500).optional().allow(null),
  status: Joi.string().valid('PENDING', 'SHORTLISTED', 'REJECTED').optional(),
}).options({ allowUnknown: false });

const listApplicationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  job_id: Joi.number().integer().positive().optional(),
  user_id: Joi.number().integer().positive().optional(),
  status: Joi.string().valid('PENDING', 'SHORTLISTED', 'REJECTED').optional(),
  search: Joi.string().trim().max(200).optional(),
  applied_date_from: Joi.date().iso().optional(),
  applied_date_to: Joi.date().iso().optional(),
}).options({ allowUnknown: true });

const createApplicationValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error, value } = createApplicationSchema.validate(request.body, {
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

const updateApplicationValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error, value } = updateApplicationSchema.validate(request.body, {
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

const listApplicationsValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error, value } = listApplicationQuerySchema.validate(request.query, {
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
  createApplicationValidation,
  updateApplicationValidation,
  listApplicationsValidation,
};
