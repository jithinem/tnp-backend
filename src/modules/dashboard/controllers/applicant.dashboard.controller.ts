import type { Request, Response } from 'express';

import { applicantDashboardStats } from '@/modules/dashboard/services/applicant.dashboard';

const applicantDashboardController = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const userId = Number(request.authUser?.sub ?? request.authUserDetails?.id);

    if (!userId) {
      return response.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const result = await applicantDashboardStats(userId);

    return response.status(200).json({
      success: true,
      message: 'Applicant dashboard statistics fetched successfully',
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while fetching applicant dashboard';

    return response.status(400).json({
      success: false,
      message,
      data: null,
    });
  }
};

export { applicantDashboardController };
