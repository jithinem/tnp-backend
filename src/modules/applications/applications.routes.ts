import { Router } from 'express';

import { accessGuard } from '@/plugins/access.guard';
import { authMiddleware } from '@/modules/auth/middleware/auth.middleware';
import { roleGuard } from '@/plugins/role.guard';
import {
  createApplicationController,
  listApplicationsController,
  getApplicationDetailsController,
  updateApplicationController,
  deleteApplicationController,
} from '@/modules/applications/controllers';
import {
  createApplicationValidation,
  updateApplicationValidation,
  listApplicationsValidation,
} from '@/modules/applications/applications.validation';

const applicationRoutes = Router();

applicationRoutes.get('/', accessGuard, authMiddleware, listApplicationsValidation, listApplicationsController);
applicationRoutes.get('/:id', accessGuard, getApplicationDetailsController);
applicationRoutes.post('/', accessGuard, roleGuard(['applicant']), createApplicationValidation, createApplicationController);
applicationRoutes.put('/:id', accessGuard, roleGuard(['applicant', 'admin']), updateApplicationValidation, updateApplicationController);
applicationRoutes.delete('/:id', accessGuard, roleGuard(['applicant', 'admin']), deleteApplicationController);

export default applicationRoutes;
