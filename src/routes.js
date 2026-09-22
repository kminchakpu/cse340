import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  processNewOrganizationForm,
  organizationValidation
} from './controllers/organizations.js';

import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation
} from './controllers/projects.js';

import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  categoryValidation
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

// Organization routes
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);

router.post(
  '/new-organization',
  organizationValidation,
  processNewOrganizationForm
);

router.post(
  '/edit-organization/:id',
  organizationValidation,
  processEditOrganizationForm
);

// Project routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);

router.post(
  '/new-project',
  projectValidation,
  processNewProjectForm
);

router.post(
  '/edit-project/:id',
  projectValidation,
  processEditProjectForm
);

// Category routes
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', showNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);

router.post(
  '/new-category',
  categoryValidation,
  processNewCategoryForm
);

router.post(
  '/edit-category/:id',
  categoryValidation,
  processEditCategoryForm
);

// Assign categories to project routes
router.get(
  '/assign-categories/:projectId',
  showAssignCategoriesForm
);

router.post(
  '/assign-categories/:projectId',
  processAssignCategoriesForm
);

// Error-handling routes
router.get('/test-error', testErrorPage);

export default router;