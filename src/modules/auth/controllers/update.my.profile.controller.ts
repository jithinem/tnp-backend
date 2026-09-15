import type { Response } from 'express';
import Joi from 'joi';
import prisma from '@/shared/prisma';
import type { AuthenticatedRequest } from '@/modules/auth/middleware/auth.middleware';

const schema = Joi.object({
  first_name: Joi.string().trim().min(1).max(100).optional(),
  last_name: Joi.string().trim().min(1).max(100).optional(),
  phone_number: Joi.string().trim().pattern(/^[0-9+\-\s()]*$/).max(20).allow(null).optional(),
  profile_photo: Joi.string().trim().uri().max(500).allow(null).optional(),
}).min(1);

export const updateMyProfileController = async (request: AuthenticatedRequest, response: Response): Promise<Response> => {
  const { error, value } = schema.validate(request.body, { abortEarly: false, stripUnknown: true });
  if (error) return response.status(400).json({ success: false, message: 'Validation failed', data: error.details.map((item) => item.message) });
  if (!request.user?.id) return response.status(401).json({ success: false, message: 'Invalid access token', data: null });

  const user = await prisma.user.update({
    where: { id: request.user.id },
    data: value,
    select: { id: true, first_name: true, last_name: true, email: true, phone_number: true, profile_photo: true, is_active: true, role: { select: { name: true } } },
  });
  return response.json({ success: true, message: 'Profile updated successfully', data: { ...user, role: user.role.name } });
};
