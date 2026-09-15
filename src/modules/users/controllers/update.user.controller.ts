import type { Request, Response } from 'express';
import { updateUser } from '@/modules/users/services/update.user';

const updateUserController = async (request: Request, response: Response): Promise<Response> => {
  try {
    const user = await updateUser(Number(request.params.id), request.body);
    return response.status(200).json({ success: true, message: 'User updated successfully', data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while updating user';
    return response.status(400).json({ success: false, message, data: null });
  }
};

export { updateUserController };
