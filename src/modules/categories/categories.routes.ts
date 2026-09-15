import { Router } from 'express';

import { accessGuard } from '@/plugins/access.guard';
import { roleGuard } from '@/plugins/role.guard';
import {
  createCategoryController,
  listCategoriesController,
  listAllCategoriesController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from '@/modules/categories/controllers';
import {
  createCategoryValidation,
  updateCategoryValidation,
  listCategoriesValidation,
} from '@/modules/categories/categories.validation';

const categoryRoutes = Router();

categoryRoutes.get('/', listCategoriesValidation, accessGuard, listCategoriesController);
categoryRoutes.get('/all', accessGuard, listAllCategoriesController);
categoryRoutes.get('/:id', accessGuard, getCategoryController);
categoryRoutes.post('/', accessGuard, roleGuard(['admin']), createCategoryValidation, createCategoryController);
categoryRoutes.put('/:id', accessGuard, roleGuard(['admin']), updateCategoryValidation, updateCategoryController);
categoryRoutes.delete('/:id', accessGuard, roleGuard(['admin']), deleteCategoryController);

export default categoryRoutes;
