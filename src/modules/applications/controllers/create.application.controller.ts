import type { Request, Response } from 'express';

import { createApplication } from '@/modules/applications/services/create.application';

const createApplicationController = async (
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

    const application = await createApplication(request.body, userId);

    return response.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while creating application';

    if (message === 'Job not found or inactive') {
      return response.status(404).json({
        success: false,
        message,
        data: null,
      });
    }

    if (message === 'Application already submitted') {
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

export { createApplicationController };
