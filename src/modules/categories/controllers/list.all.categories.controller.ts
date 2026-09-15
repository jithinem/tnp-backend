import type { Request, Response } from 'express';

import { listAllCategories } from '@/modules/categories/services/list.all.categories';

const listAllCategoriesController = async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const categories = await listAllCategories();

    return response.status(200).json({
      success: true,
      message: 'All categories fetched successfully',
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

export { listAllCategoriesController };
