import type { Request, Response } from 'express';

import { createJob } from '@/modules/job/services/create.job';

const createJobController = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const job = await createJob(request.body);

    return response.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while creating job';

    if (message === 'Category not found') {
      return response.status(404).json({
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

export { createJobController };
