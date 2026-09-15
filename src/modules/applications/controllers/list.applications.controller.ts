import type { Response } from 'express';
import type { AuthenticatedRequest } from '@/modules/auth/middleware/auth.middleware';

import { listApplications } from '@/modules/applications/services/list.applications';

const listApplicationsController = async (
  request: AuthenticatedRequest,
  response: Response,
): Promise<Response> => {
  try {
    const query = {
      page: request.query.page ? Number(request.query.page) : undefined,
      limit: request.query.limit ? Number(request.query.limit) : undefined,
      job_id: request.query.job_id ? Number(request.query.job_id) : undefined,
      user_id: request.user?.role === 'admin' ? (request.query.user_id ? Number(request.query.user_id) : undefined) : request.user?.id,
      status: typeof request.query.status === 'string'
        ? request.query.status as 'PENDING' | 'SHORTLISTED' | 'REJECTED'
        : undefined,
      search: typeof request.query.search === 'string' ? request.query.search : undefined,
      applied_date_from: typeof request.query.applied_date_from === 'string' ? request.query.applied_date_from : undefined,
      applied_date_to: typeof request.query.applied_date_to === 'string' ? request.query.applied_date_to : undefined,
    };

    const applications = await listApplications(query);

    return response.status(200).json({
      success: true,
      message: 'Applications fetched successfully',
      data: applications,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while fetching applications';

    return response.status(400).json({
      success: false,
      message,
      data: null,
    });
  }
};

export { listApplicationsController };
