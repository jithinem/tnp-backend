import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(150).required(),
}).options({ allowUnknown: false });

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(150).optional(),
}).options({ allowUnknown: false });

const listCategoryQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
}).options({ allowUnknown: true });

const createCategoryValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error, value } = createCategorySchema.validate(request.body, {
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

const updateCategoryValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error, value } = updateCategorySchema.validate(request.body, {
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

const listCategoriesValidation = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { error } = listCategoryQuerySchema.validate(request.query, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    response.status(400).json({
      success: false,
      message: error.details.map((detail) => detail.message).join(', '),
      data: null,
    });
    return;
  }

  next();
};

export {
  createCategoryValidation,
  updateCategoryValidation,
  listCategoriesValidation,
};
