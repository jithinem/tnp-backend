import type { Request, Response } from 'express';

import { adminDashboardStats } from '@/modules/dashboard/services/admin.dashboard';

const adminDashboardController = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const result = await adminDashboardStats();

    return response.status(200).json({
      success: true,
      message: 'Admin dashboard statistics fetched successfully',
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while fetching admin dashboard';

    return response.status(400).json({
      success: false,
      message,
      data: null,
    });
  }
};

export { adminDashboardController };
