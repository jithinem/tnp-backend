import type { Request, Response } from 'express';

import { listJobs } from '@/modules/job/services/list.jobs';

const listJobsController = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const query = {
      page: request.query.page ? Number(request.query.page) : undefined,
      limit: request.query.limit ? Number(request.query.limit) : undefined,
      category_id: request.query.category_id ? Number(request.query.category_id) : undefined,
      is_active: request.query.is_active ? request.query.is_active === 'true' : undefined,
      is_featured: request.query.is_featured ? request.query.is_featured === 'true' : undefined,
      employment_type: typeof request.query.employment_type === 'string'
        ? request.query.employment_type
        : undefined,
      search: typeof request.query.search === 'string' ? request.query.search : undefined,
      application_status: typeof request.query.application_status === 'string'
        ? request.query.application_status
        : undefined,
      user_id: request.query.user_id ? Number(request.query.user_id) : undefined,
    };

    const jobs = await listJobs(query);

    return response.status(200).json({
      success: true,
      message: 'Jobs fetched successfully',
      data: jobs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while fetching jobs';

    return response.status(400).json({
      success: false,
      message,
      data: null,
    });
  }
};

export { listJobsController };
