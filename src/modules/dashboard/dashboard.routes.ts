import { Router } from 'express';

import { accessGuard } from '@/plugins/access.guard';
import { roleGuard } from '@/plugins/role.guard';
import {
  adminDashboardController,
  applicantDashboardController,
} from '@/modules/dashboard/controllers';

const dashboardRoutes = Router();

dashboardRoutes.get('/admin', accessGuard, roleGuard(['admin']), adminDashboardController);
dashboardRoutes.get('/applicant', accessGuard, roleGuard(['applicant']), applicantDashboardController);

export default dashboardRoutes;
