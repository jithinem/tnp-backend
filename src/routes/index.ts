
import { Router } from 'express';

import authRoutes from '@/modules/auth/auth.routes';
import jobRoutes from '@/modules/job/job.routes';
import categoryRoutes from '@/modules/categories/categories.routes';
import applicationRoutes from '@/modules/applications/applications.routes';
import dashboardRoutes from '@/modules/dashboard/dashboard.routes';
import uploadsRoutes from '@/modules/uploads/uploads.routes';
import userRoutes from '@/modules/users/user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/categories', categoryRoutes);
router.use('/applications', applicationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/users', userRoutes);

export default router;
