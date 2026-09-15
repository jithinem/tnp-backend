import type { Request, Response } from 'express';

import { createCategory } from '@/modules/categories/services/create.category';

const createCategoryController = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const category = await createCategory(request.body);

    return response.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while creating category';

    if (message === 'Category already exists') {
      return response.status(409).json({
        success: false,
        message,
        data: null,
      });
    }

    return response.status(400).json({
      success: false,
      message,
      data: null,
    });
  }
};

export { createCategoryController };
