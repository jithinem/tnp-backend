import type { Request, Response } from 'express';

import { updateApplication } from '@/modules/applications/services/update.application';

const updateApplicationController = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  try {
    const id = Number(request.params.id);

    if (Number.isNaN(id)) {
      return response.status(400).json({
        success: false,
        message: 'Invalid application id',
        data: null,
      });
    }

    const userId = Number(request.authUser?.sub ?? request.authUserDetails?.id);
    const role = request.authUserDetails?.role?.name ?? null;

    const application = await updateApplication(id, request.body, userId, role);

    return response.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while updating application';

    if (message === 'Application not found') {
      return response.status(404).json({
        success: false,
        message,
        data: null,
      });
    }

    if (message === 'Unauthorized') {
      return response.status(403).json({
        success: false,
        message,
        data: null,
      });
    }

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

export { updateApplicationController };
