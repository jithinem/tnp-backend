import type { Request, Response } from 'express';

import { deleteJob } from '@/modules/job/services/delete.job';

const deleteJobController = async (
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

    const job = await deleteJob(id);

    return response.status(200).json({
      success: true,
      message: 'Job deleted successfully',
      data: job,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while deleting job';

    if (message === 'Job not found') {
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

export { deleteJobController };
