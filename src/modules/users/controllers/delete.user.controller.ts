import type { Request, Response } from 'express';
import { deleteUser } from '@/modules/users/services/delete.user';

const deleteUserController = async (request: Request, response: Response): Promise<Response> => {
  try {
    await deleteUser(Number(request.params.id));
    return response.status(200).json({ success: true, message: 'User deleted successfully', data: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while deleting user';
    return response.status(400).json({ success: false, message, data: null });
  }
};

export { deleteUserController };
