import type { Request, Response } from 'express';

import { updateJob } from '@/modules/job/services/update.job';

const updateJobController = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        success: false,
        message: 'Invalid job id',
        data: null,
      });
    }

    const job = await updateJob(id, request.body);

    return response.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while updating job';

    if (message === 'Job not found') {
      return response.status(404).json({
        success: false,
        message,
        data: null,
      });
    }

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

export { updateJobController };
