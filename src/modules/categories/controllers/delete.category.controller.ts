import type { Request, Response } from 'express';

import { deleteCategory } from '@/modules/categories/services/delete.category';

const deleteCategoryController = async (
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

    const category = await deleteCategory(id);

    return response.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while deleting category';

    if (message === 'Category not found') {
      return response.status(404).json({
        success: false,
        message,
        data: null,
      });
    }

    if (message === 'Cannot delete category with jobs') {
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

export { deleteCategoryController };
