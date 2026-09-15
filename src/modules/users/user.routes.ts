import { Router } from 'express';
import { accessGuard } from '@/plugins/access.guard';
import { roleGuard } from '@/plugins/role.guard';
import {
  listUsersController,
  createUserController,
  updateUserController,
  deleteUserController,
} from '@/modules/users/controllers';
import { createUserValidation, updateUserValidation, listUsersValidation } from '@/modules/users/users.validation';

const userRoutes = Router();

userRoutes.get('/', accessGuard, roleGuard(['admin']), listUsersValidation, listUsersController);
userRoutes.post('/', accessGuard, roleGuard(['admin']), createUserValidation, createUserController);
userRoutes.put('/:id', accessGuard, roleGuard(['admin']), updateUserValidation, updateUserController);
userRoutes.delete('/:id', accessGuard, roleGuard(['admin']), deleteUserController);

export default userRoutes;
