import type { Request, Response } from 'express';
import { createUser } from '@/modules/users/services/create.user';

const createUserController = async (request: Request, response: Response): Promise<Response> => {
  try {
    const user = await createUser(request.body);
    return response.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error while creating user';
    return response.status(400).json({ success: false, message, data: null });
  }
};

export { createUserController };
