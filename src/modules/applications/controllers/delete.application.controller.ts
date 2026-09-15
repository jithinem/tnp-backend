import type { Request, Response } from 'express';

import { deleteApplication } from '@/modules/applications/services/delete.application';

const deleteApplicationController = async (
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

    const application = await deleteApplication(id, userId, role);

    return response.status(200).json({
      success: true,
      message: 'Application deleted successfully',
      data: application,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while deleting application';

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

    return response.status(400).json({
      success: false,
      message,
      data: null,
    });
  }
};

export { deleteApplicationController };
