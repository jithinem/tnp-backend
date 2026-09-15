import type { Request, Response } from 'express';
import { listUsers } from '@/modules/users/services/list.users';

const listUsersController = async (request: Request, response: Response): Promise<Response> => {
  try {
    const query = {
      page: request.query.page ? Number(request.query.page) : undefined,
      limit: request.query.limit ? Number(request.query.limit) : undefined,
      role: typeof request.query.role === 'string' ? request.query.role : undefined,
      search: typeof request.query.search === 'string' ? request.query.search : undefined,
      is_active: typeof request.query.is_active === 'string' ? request.query.is_active === 'true' : undefined,
    };

    const users = await listUsers(query);

    return response.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while fetching users';
    return response.status(400).json({ success: false, message, data: null });
  }
};

export { listUsersController };
