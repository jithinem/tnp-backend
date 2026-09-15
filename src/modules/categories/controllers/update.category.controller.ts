import type { Request, Response } from 'express';

import { updateCategory } from '@/modules/categories/services/update.category';

const updateCategoryController = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        success: false,
        message: 'Invalid category id',
        data: null,
      });
    }

    const category = await updateCategory(id, request.body);

    return response.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while updating category';

    if (message === 'Category not found') {
      return response.status(404).json({
        success: false,
        message,
        data: null,
      });
    }

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

export { updateCategoryController };
