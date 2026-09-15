import { Router } from 'express';

import { accessGuard } from '@/plugins/access.guard';
import { roleGuard } from '@/plugins/role.guard';
import {
  createJobController,
  listJobsController,
  getJobController,
  updateJobController,
  deleteJobController,
} from '@/modules/job/controllers';
import {
  createJobValidation,
  updateJobValidation,
  listJobsValidation,
} from '@/modules/job/job.validation';

const jobRoutes = Router();

jobRoutes.get('/', listJobsValidation, accessGuard, listJobsController);
jobRoutes.get('/:id', accessGuard, getJobController);
jobRoutes.post('/', accessGuard, roleGuard(['admin']), createJobValidation, createJobController);
jobRoutes.put('/:id', accessGuard, roleGuard(['admin']), updateJobValidation, updateJobController);
jobRoutes.delete('/:id', accessGuard, roleGuard(['admin']), deleteJobController);

export default jobRoutes;
