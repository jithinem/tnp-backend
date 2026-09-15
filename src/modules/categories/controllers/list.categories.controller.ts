import type { Request, Response } from 'express';

import { listCategories } from '@/modules/categories/services/list.categories';

const listCategoriesController = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const page = request.query.page ? Number(request.query.page) : 1;
    const limit = request.query.limit ? Number(request.query.limit) : 10;

    const categories = await listCategories({ page, limit });

    return response.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while fetching categories';

    return response.status(400).json({
      success: false,
      message,
      data: null,
    });
  }
};

export { listCategoriesController };
